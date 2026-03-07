import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { exchangeCodeForTokens } from "@/lib/googleDriveUser";
import { insertChangelog } from "@/lib/changelog";

export async function GET(req: NextRequest) {
  const url = req.nextUrl;
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const redirectTo = state ? decodeURIComponent(state) : "/settings/drive";

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const origin = new URL(req.url).origin;

  if (!user || !code) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const tokens = await exchangeCodeForTokens(code);

    if (!tokens.refresh_token) {
      const target = new URL(redirectTo, origin);
      target.searchParams.set("connected", "1");
      return NextResponse.redirect(target.toString());
    }

    const { error } = await supabase.from("user_drive_settings").upsert(
      {
        user_id: user.id,
        drive_refresh_token: tokens.refresh_token,
        root_folder_id: null,
        root_folder_name: null,
        root_folder_url: null
      },
      { onConflict: "user_id" }
    );

    if (error) {
      console.error("Failed to upsert user_drive_settings", error);
    } else {
      await insertChangelog(supabase, {
        user_id: user.id,
        action: "drive_connected"
      });
    }
  } catch (err) {
    console.error("OAuth callback error", err);
  }

  const target = new URL(redirectTo, origin);
  target.searchParams.set("connected", "1");
  return NextResponse.redirect(target.toString());
}


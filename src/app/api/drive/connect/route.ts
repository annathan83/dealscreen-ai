import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserDriveAuthUrl } from "@/lib/googleDriveUser";

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  const url = req.nextUrl;
  const redirectTo = url.searchParams.get("redirectTo") ?? "/settings/drive";

  if (!user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("redirectTo", redirectTo);
    return NextResponse.redirect(loginUrl);
  }

  const state = encodeURIComponent(redirectTo);
  const authUrl = getUserDriveAuthUrl(state);

  return NextResponse.redirect(authUrl);
}


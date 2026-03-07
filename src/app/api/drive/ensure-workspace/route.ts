import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { ensureUserWorkspaceRootFolder } from "@/lib/googleDriveUser";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: settings } = await supabase
    .from("user_drive_settings")
    .select("drive_refresh_token, root_folder_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!settings?.drive_refresh_token) {
    return NextResponse.json({ error: "not_connected" }, { status: 400 });
  }

  if (settings.root_folder_id) {
    return NextResponse.json({ ok: true, alreadySet: true });
  }

  try {
    const { id: rootId, url: rootUrl } = await ensureUserWorkspaceRootFolder(
      settings.drive_refresh_token
    );

    const { error } = await supabase
      .from("user_drive_settings")
      .update({
        root_folder_id: rootId,
        root_folder_name: "DealHub AI",
        root_folder_url: rootUrl,
        updated_at: new Date().toISOString()
      })
      .eq("user_id", user.id);

    if (error) {
      console.error("ensure-workspace update error", error);
      return NextResponse.json(
        { error: "update_failed" },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, rootId, rootUrl });
  } catch (err) {
    console.error("ensure-workspace error", err);
    return NextResponse.json(
      { error: "workspace_setup_failed" },
      { status: 500 }
    );
  }
}

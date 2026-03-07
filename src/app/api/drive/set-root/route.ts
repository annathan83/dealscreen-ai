import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);

  const folderId = (body?.folderId as string | undefined)?.trim() ?? "";
  const folderName = (body?.folderName as string | undefined)?.trim() ?? "";
  const folderUrl = (body?.folderUrl as string | undefined)?.trim() ?? "";

  const { data: settings, error: settingsError } = await supabase
    .from("user_drive_settings")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (settingsError) {
    console.error("set-root fetch error", settingsError);
  }

  if (!settings) {
    return NextResponse.json(
      { error: "not_connected" },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("user_drive_settings")
    .update({
      root_folder_id: folderId || null,
      root_folder_name: folderId ? (folderName || "Workspace root") : null,
      root_folder_url: folderId ? (folderUrl || `https://drive.google.com/drive/folders/${folderId}`) : null
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("set-root update error", error);
    return NextResponse.json(
      { error: "update_failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ ok: true });
}


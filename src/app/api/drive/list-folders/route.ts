import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getUserDriveClient } from "@/lib/googleDriveUser";

export async function GET(req: NextRequest) {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: settings, error } = await supabase
    .from("user_drive_settings")
    .select("drive_refresh_token")
    .eq("user_id", user.id)
    .maybeSingle();

  if (error || !settings?.drive_refresh_token) {
    return NextResponse.json(
      { error: "not_connected" },
      { status: 400 }
    );
  }

  try {
    const drive = getUserDriveClient(settings.drive_refresh_token);
    const { data } = await drive.files.list({
      // List up to 50 non-trashed folders anywhere in the user's Drive.
      // This is more forgiving than only listing root-level folders,
      // since many users keep everything inside one or more subfolders.
      q: "mimeType = 'application/vnd.google-apps.folder' and trashed = false",
      fields: "files(id, name, webViewLink, parents)",
      pageSize: 50,
      orderBy: "name"
    });

    return NextResponse.json({
      folders:
        data.files?.map((f) => ({
          id: f.id,
          name: f.name,
          url: f.webViewLink ?? (f.id ? `https://drive.google.com/drive/folders/${f.id}` : null)
        })) ?? []
    });
  } catch (err) {
    console.error("list-folders error", err);
    return NextResponse.json(
      { error: "drive_error" },
      { status: 500 }
    );
  }
}


import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { insertChangelog } from "@/lib/changelog";

export async function POST() {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { error } = await supabase
    .from("user_drive_settings")
    .update({
      drive_refresh_token: null,
      root_folder_id: null,
      root_folder_name: null,
      root_folder_url: null,
      updated_at: new Date().toISOString()
    })
    .eq("user_id", user.id);

  if (error) {
    console.error("disconnect update error", error);
    return NextResponse.json(
      { error: "update_failed" },
      { status: 500 }
    );
  }

  await insertChangelog(supabase, {
    user_id: user.id,
    action: "drive_disconnected"
  });

  return NextResponse.json({ ok: true });
}

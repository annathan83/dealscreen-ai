import { cookies } from "next/headers";
import Link from "next/link";
import { createServerClient } from "@supabase/ssr";
import { env } from "@/lib/config";
import { Button } from "@/components/ui/button";
import { DriveRootSelector } from "@/components/settings/DriveRootSelector";
import { DisconnectDriveButton } from "@/components/settings/DisconnectDriveButton";

async function getSettings() {
  const cookieStore = cookies();

  const supabase = createServerClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set() {},
        remove() {}
      }
    }
  );

  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data } = await supabase
    .from("user_drive_settings")
    .select("drive_refresh_token, root_folder_id, root_folder_name, root_folder_url")
    .eq("user_id", user.id)
    .maybeSingle();

  const isConnected = !!data?.drive_refresh_token;

  return {
    userId: user.id,
    isConnected,
    rootFolderId: data?.root_folder_id ?? null,
    rootFolderName: data?.root_folder_name ?? null,
    rootFolderUrl: data?.root_folder_url ?? null
  };
}

export default async function DriveSettingsPage() {
  const settings = await getSettings();

  return (
    <div className="space-y-6 max-w-xl">
      <div className="page-header">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            Google Drive workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Connect your own Google Drive. DealHub AI will create and use its
            own workspace folder and won&apos;t see the rest of your Drive.
          </p>
        </div>
      </div>

      <div className="card p-5 sm:p-6 space-y-5">
        {!settings && (
          <p className="text-sm text-muted-foreground">
            You need to be signed in to configure Drive.
          </p>
        )}

        {settings && (
          <>
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">
                1. Connect Google Drive
              </div>
              <p className="text-sm text-muted-foreground">
                Authorize DealHub AI to create folders in your Drive. The app
                only accesses its own workspace folder.
              </p>
              <div className="flex flex-wrap gap-2">
                {settings.isConnected ? (
                  <DisconnectDriveButton />
                ) : (
                  <Link href="/api/drive/connect?redirectTo=/settings/drive">
                    <Button size="sm">Connect Google Drive</Button>
                  </Link>
                )}
              </div>
            </div>

            <div className="border-t border-border/60 pt-5">
              <DriveRootSelector
                isConnected={settings.isConnected}
                initialRootFolderId={settings.rootFolderId}
                initialRootFolderName={settings.rootFolderName}
                initialRootFolderUrl={settings.rootFolderUrl}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}


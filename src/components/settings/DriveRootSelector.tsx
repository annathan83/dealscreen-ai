"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  isConnected: boolean;
  initialRootFolderId: string | null;
  initialRootFolderName: string | null;
  initialRootFolderUrl: string | null;
}

export function DriveRootSelector(props: Props) {
  const hasRoot = !!props.initialRootFolderId;
  const [settingUp, setSettingUp] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!props.isConnected || hasRoot || settingUp) return;
    let cancelled = false;
    setSettingUp(true);
    fetch("/api/drive/ensure-workspace", { method: "POST" })
      .then((res) => {
        if (cancelled) return;
        if (res.ok) router.refresh();
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setSettingUp(false);
      });
    return () => {
      cancelled = true;
    };
  }, [props.isConnected, hasRoot, router]);

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium text-foreground">
        2. Workspace folder (no extra access)
      </div>
      <p className="text-sm text-muted-foreground">
        When you connect Google Drive, DealHub AI creates a{" "}
        <span className="font-medium">DealHub AI</span> folder in your Drive
        and only reads/writes inside that folder and its subfolders. Your other
        Drive content is not visible to the app.
      </p>

      {settingUp && !hasRoot && (
        <p className="text-sm text-muted-foreground">
          Setting up workspace folder…
        </p>
      )}

      {hasRoot && (
        <p className="text-sm text-muted-foreground">
          Workspace root:{" "}
          <a
            href={props.initialRootFolderUrl ?? undefined}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline hover:opacity-90"
          >
            {props.initialRootFolderName ?? props.initialRootFolderId} (open in
            Drive)
          </a>
        </p>
      )}

      {!hasRoot && !settingUp && (
        <p className="text-sm text-muted-foreground">
          {props.isConnected
            ? "Workspace folder will be ready when you create your first deal."
            : "After you connect Drive above, the workspace folder will appear here."}
        </p>
      )}
    </div>
  );
}

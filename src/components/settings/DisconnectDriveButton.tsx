"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function DisconnectDriveButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDisconnect() {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch("/api/drive/disconnect", { method: "POST" });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      disabled={loading}
      onClick={handleDisconnect}
    >
      {loading ? "Disconnecting…" : "Disconnect Google Drive"}
    </Button>
  );
}

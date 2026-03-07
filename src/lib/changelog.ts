import type { SupabaseClient } from "@supabase/supabase-js";

export type ChangelogAction =
  | "deal_created"
  | "deal_updated"
  | "input_added"
  | "analysis_run"
  | "file_added"
  | "drive_connected"
  | "drive_disconnected";

export const CHANGELOG_ACTION_LABELS: Record<ChangelogAction, string> = {
  deal_created: "Deal created",
  deal_updated: "Deal updated",
  input_added: "Input added",
  analysis_run: "Analysis run",
  file_added: "File added",
  drive_connected: "Drive connected",
  drive_disconnected: "Drive disconnected"
};

export function getChangelogLabel(action: string): string {
  return (
    CHANGELOG_ACTION_LABELS[action as ChangelogAction] ?? action.replace(/_/g, " ")
  );
}

export interface ChangelogEntry {
  user_id: string;
  deal_id?: string | null;
  action: ChangelogAction;
  details?: Record<string, unknown> | null;
}

/**
 * Append a row to deal_changelog. Call from server actions/API routes with the current Supabase client.
 * Does not throw; logs errors to console.
 */
export async function insertChangelog(
  supabase: SupabaseClient,
  entry: ChangelogEntry
): Promise<void> {
  const { error } = await supabase.from("deal_changelog").insert({
    user_id: entry.user_id,
    deal_id: entry.deal_id ?? null,
    action: entry.action,
    details: entry.details ?? null
  });

  if (error) {
    console.error("Changelog insert failed", error);
  }
}

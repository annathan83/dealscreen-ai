import Link from "next/link";
import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  Deal,
  DealInput,
  DealFile,
  DealAnalysisRow,
  DealChangelogRow
} from "@/lib/types";
import { insertChangelog, getChangelogLabel } from "@/lib/changelog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

async function getDealWorkspace(id: string) {
  const supabase = createSupabaseServerClient();

  const {
    data: { user }
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: deal, error: dealError } = await supabase
    .from("deals")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (dealError || !deal) {
    console.error(dealError);
    return null;
  }

  const { data: inputs } = await supabase
    .from("deal_inputs")
    .select("*")
    .eq("deal_id", id)
    .order("created_at", { ascending: false });

  const { data: files } = await supabase
    .from("deal_files")
    .select("*")
    .eq("deal_id", id)
    .order("created_at", { ascending: false });

  const { data: analyses } = await supabase
    .from("deal_analyses")
    .select("*")
    .eq("deal_id", id)
    .order("created_at", { ascending: false });

  const { data: changelog } = await supabase
    .from("deal_changelog")
    .select("*")
    .eq("deal_id", id)
    .order("created_at", { ascending: false })
    .limit(50);

  const latestAnalysis = analyses?.[0] ?? null;

  return {
    deal: deal as Deal,
    inputs: (inputs ?? []) as DealInput[],
    files: (files ?? []) as DealFile[],
    analyses: (analyses ?? []) as DealAnalysisRow[],
    latestAnalysis: latestAnalysis as DealAnalysisRow | null,
    changelog: (changelog ?? []) as DealChangelogRow[]
  };
}

async function addInput(formData: FormData) {
  "use server";

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const dealId = formData.get("deal_id")?.toString();
  const inputType =
    (formData.get("input_type")?.toString() as
      | "listing_text"
      | "broker_email"
      | "note"
      | "manual_summary"
      | "snippet") ?? "note";
  const title = formData.get("title")?.toString() ?? "";
  const content = formData.get("content")?.toString() ?? "";

  if (!dealId || !content.trim()) return;

  const { error } = await supabase.from("deal_inputs").insert({
    deal_id: dealId,
    user_id: user.id,
    input_type: inputType,
    title: title || null,
    content
  });

  if (error) {
    console.error("Failed to add input", error);
    return;
  }

  await insertChangelog(supabase, {
    user_id: user.id,
    deal_id: dealId,
    action: "input_added",
    details: { input_type: inputType, title: title || null }
  });
}

async function runAnalysis(formData: FormData) {
  "use server";

  const dealId = formData.get("deal_id")?.toString();
  if (!dealId) return;

  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const { data: dealRow } = await supabase
    .from("deals")
    .select("*")
    .eq("id", dealId)
    .single();

  if (!dealRow) return;

  const { data: inputs } = await supabase
    .from("deal_inputs")
    .select("*")
    .eq("deal_id", dealId);

  const { data: files } = await supabase
    .from("deal_files")
    .select("*")
    .eq("deal_id", dealId);

  const { runDealAnalysis } = await import("@/lib/analysis/runDealAnalysis");

  const result = await runDealAnalysis(
    dealRow as Deal,
    (inputs ?? []) as DealInput[],
    (files ?? []) as DealFile[]
  );

  const { error } = await supabase.from("deal_analyses").insert({
    deal_id: dealId,
    user_id: user.id,
    extracted_json: result.extraction,
    analysis_json: result,
    score: result.score,
    verdict: result.verdict,
    recommendation: result.recommendation
  });

  if (error) {
    console.error("Failed to save analysis", error);
    return;
  }

  await insertChangelog(supabase, {
    user_id: user.id,
    deal_id: dealId,
    action: "analysis_run",
    details: { score: result.score, verdict: result.verdict, recommendation: result.recommendation }
  });
}

export default async function DealWorkspacePage({
  params
}: {
  params: { id: string };
}) {
  const workspace = await getDealWorkspace(params.id);

  if (!workspace) {
    notFound();
  }

  const { deal, inputs, files, analyses, latestAnalysis, changelog } = workspace;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-semibold text-foreground">
              {deal.deal_code}
            </span>
            {deal.status && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground uppercase tracking-wide">
                {deal.status}
              </span>
            )}
          </div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            {deal.title || deal.business_name || "Untitled deal"}
          </h1>
          <p className="text-sm text-muted-foreground flex flex-wrap gap-2">
            {deal.business_name && <span>{deal.business_name}</span>}
            {deal.industry && (
              <span className="before:content-['•'] before:mr-1">
                {deal.industry}
              </span>
            )}
            {deal.location && (
              <span className="before:content-['•'] before:mr-1">
                {deal.location}
              </span>
            )}
            {deal.source && (
              <span className="before:content-['•'] before:mr-1">
                {deal.source}
              </span>
            )}
          </p>
        </div>
        <div className="flex flex-col items-start sm:items-end gap-2">
          {deal.drive_folder_url ? (
            <Link
              href={deal.drive_folder_url}
              target="_blank"
              className="text-sm text-primary hover:opacity-90 underline"
            >
              Open Drive folder
            </Link>
          ) : (
            <span className="text-sm text-muted-foreground">
              Drive folder not available (check configuration)
            </span>
          )}

          <form action={runAnalysis}>
            <input type="hidden" name="deal_id" value={deal.id} />
            <Button type="submit" size="sm">
              Run analysis
            </Button>
          </form>
        </div>
      </div>

      <div className="grid-section md:grid-two">
        <section className="space-y-3">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Notes & inputs</div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Paste listing text, broker emails, and your own notes.
                </p>
              </div>
            </div>
            <div className="card-body space-y-4">
              <form action={addInput} className="space-y-3">
                <input type="hidden" name="deal_id" value={deal.id} />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Input type
                    </label>
                    <select
                      name="input_type"
                      className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm"
                    >
                      <option value="listing_text">Listing text</option>
                      <option value="broker_email">Broker email</option>
                      <option value="note">Note</option>
                      <option value="manual_summary">Manual summary</option>
                      <option value="snippet">Snippet</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Short label
                    </label>
                    <input
                      name="title"
                      className="h-10 w-full rounded-xl border border-input bg-card px-3 text-sm placeholder:text-muted-foreground"
                      placeholder="e.g. Broker teaser 1"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Content
                  </label>
                  <Textarea
                    name="content"
                    placeholder="Paste or type here..."
                    rows={5}
                  />
                </div>
                <div className="flex justify-end">
                  <Button type="submit" size="sm">
                    Add input
                  </Button>
                </div>
              </form>

              <div className="border-t border-border/60 pt-4 space-y-2 max-h-[320px] overflow-auto">
                {inputs.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No inputs yet. Add your first snippet above.
                  </p>
                ) : (
                  inputs.map((input) => (
                    <div
                      key={input.id}
                      className="border border-border/60 rounded-xl p-3 bg-muted/40"
                    >
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                            {input.input_type.replace("_", " ")}
                          </span>
                          {input.title && (
                            <span className="text-sm font-medium text-foreground">
                              {input.title}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(input.created_at).toLocaleString(
                            undefined,
                            {
                              month: "short",
                              day: "numeric"
                            }
                          )}
                        </span>
                      </div>
                      <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                        {input.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Files (V1 metadata only)</div>
            </div>
            <div className="card-body space-y-3">
              <div className="rounded-xl border border-dashed border-border bg-muted/40 px-4 py-4 text-sm text-muted-foreground">
                File uploads into Drive are not fully wired in V1. You can
                manually upload into the deal&apos;s Drive folder and then
                register key documents here in a future iteration.
              </div>
              <div className="space-y-2">
                {files.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    No files registered yet.
                  </p>
                ) : (
                  files.map((file) => (
                    <div
                      key={file.id}
                      className="flex items-center justify-between gap-2 text-sm border border-border/60 rounded-xl px-3 py-2.5"
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          {file.file_name}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {file.mime_type || "Unknown type"}
                        </div>
                      </div>
                      {file.external_url && (
                        <Link
                          href={file.external_url}
                          target="_blank"
                          className="text-sm text-primary hover:opacity-90 underline"
                        >
                          Open
                        </Link>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-3">
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Latest analysis</div>
                <p className="text-sm text-muted-foreground mt-0.5">
                  AI-assisted extraction + deterministic scoring and risk flags.
                </p>
              </div>
            </div>
            <div className="card-body space-y-4 text-sm text-foreground/90">
              {!latestAnalysis ? (
                <p className="text-sm text-muted-foreground">
                  No analysis yet. Click &quot;Run analysis&quot; above once you
                  have at least one input.
                </p>
              ) : (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-full bg-primary/15 text-primary font-medium">
                      Score: {latestAnalysis.score?.toFixed(1) ?? "–"}
                    </span>
                    <span className="text-xs text-foreground">
                      {latestAnalysis.verdict}
                    </span>
                    {latestAnalysis.recommendation && (
                      <span className="text-xs text-muted-foreground">
                        Recommendation: {latestAnalysis.recommendation}
                      </span>
                    )}
                  </div>

                  {latestAnalysis.analysis_json?.narrative?.overview && (
                    <div className="space-y-1">
                      <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                        Narrative
                      </div>
                      <p className="whitespace-pre-wrap">
                        {latestAnalysis.analysis_json.narrative.overview}
                      </p>
                    </div>
                  )}

                  {latestAnalysis.analysis_json?.riskFlags &&
                    latestAnalysis.analysis_json.riskFlags.length > 0 && (
                      <div className="space-y-1">
                        <div className="font-semibold text-xs text-muted-foreground uppercase tracking-wide">
                          Risk flags
                        </div>
                        <ul className="space-y-2">
                          {latestAnalysis.analysis_json.riskFlags.map(
                            (risk) => (
                              <li
                                key={risk.id}
                                className="border border-border/60 rounded-xl px-3 py-2 bg-muted/40"
                              >
                                <div className="flex justify-between items-center gap-2">
                                  <span className="font-medium text-foreground">
                                    {risk.title}
                                  </span>
                                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">
                                    {risk.severity}
                                  </span>
                                </div>
                                <p className="text-xs text-foreground/90 mt-1">
                                  {risk.explanation}
                                </p>
                              </li>
                            )
                          )}
                        </ul>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Analysis history</div>
            </div>
            <div className="card-body space-y-2 max-h-[260px] overflow-auto">
              {analyses.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No prior runs. Each analysis run will be captured here going
                  forward.
                </p>
              ) : (
                analyses.map((analysis) => (
                  <div
                    key={analysis.id}
                    className="flex items-center justify-between gap-2 text-sm border border-border/60 rounded-xl px-3 py-2.5"
                  >
                    <div className="space-y-0.5">
                      <div className="font-medium text-foreground">
                        {new Date(analysis.created_at).toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Score:{" "}
                        {analysis.score !== null
                          ? analysis.score.toFixed(1)
                          : "–"}{" "}
                        | {analysis.verdict ?? "No verdict"}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="card">
            <div className="card-header">
              <div className="card-title">Changelog</div>
              <p className="text-sm text-muted-foreground mt-0.5">
                Timestamped log of changes for this deal.
              </p>
            </div>
            <div className="card-body space-y-2 max-h-[280px] overflow-auto">
              {changelog.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  No entries yet.
                </p>
              ) : (
                changelog.map((entry) => (
                  <div
                    key={entry.id}
                    className="border border-border/60 rounded-xl px-3 py-2.5 space-y-1"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
                      <span className="font-medium text-foreground">
                        {getChangelogLabel(entry.action)}
                      </span>
                      <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleString(undefined, {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                    {entry.details && Object.keys(entry.details).length > 0 && (
                      <div className="text-xs text-muted-foreground flex flex-wrap gap-x-3 gap-y-0.5">
                        {entry.details.deal_code != null && (
                          <span>Code: {String(entry.details.deal_code)}</span>
                        )}
                        {entry.details.input_type != null && (
                          <span>Type: {String(entry.details.input_type).replace("_", " ")}</span>
                        )}
                        {entry.details.score != null && (
                          <span>Score: {Number(entry.details.score).toFixed(1)}</span>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}


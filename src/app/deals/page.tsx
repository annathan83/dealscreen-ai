import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Deal, DealAnalysisRow } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface DealWithLatestAnalysis extends Deal {
  latest_analysis: Pick<
    DealAnalysisRow,
    "id" | "score" | "verdict" | "recommendation" | "created_at" | "extracted_json"
  > | null;
}

async function getDealsForUser(): Promise<DealWithLatestAnalysis[]> {
  const supabase = createSupabaseServerClient();
  const {
    data: { user }
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("deals")
    .select(
      `
      *,
      deal_analyses (
        id,
        score,
        verdict,
        recommendation,
        created_at,
        extracted_json
      )
    `
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    console.error(error);
    return [];
  }

  return (data as any[]).map((row) => {
    const analyses = (row.deal_analyses || []) as DealAnalysisRow[];
    const latest =
      analyses.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )[0] ?? null;

    const { deal_analyses, ...deal } = row;
    return { ...(deal as Deal), latest_analysis: latest };
  });
}

const STATUS_LABELS: Record<string, string> = {
  new: "New",
  "nda requested": "NDA requested",
  "cim received": "CIM received",
  "loi negotiations": "LOI negotiations",
  "loi signed": "LOI signed",
  "due diligence": "Due Diligence",
  closed: "Closed",
  canceled: "Canceled"
};

function formatDate(date: string | null): string {
  if (!date) return "–";
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}

function formatCurrency(n: number | null | undefined): string {
  if (n == null) return "–";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(n);
}

export default async function DealsPage() {
  const deals = await getDealsForUser();

  return (
    <div className="space-y-6">
      <div className="page-header">
        <div>
          <h1 className="text-xl md:text-2xl font-semibold tracking-tight text-foreground">
            Deal workspace
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Each row is a structured workspace with notes, files, and analysis.
          </p>
        </div>
        <Link href="/deals/new">
          <Button size="sm">Create deal</Button>
        </Link>
      </div>

      <div className="card overflow-hidden">
        {deals.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No deals yet. Start by creating your first workspace.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/60 bg-muted/30">
                  <th className="text-left font-medium text-foreground px-4 py-3">
                    ID
                  </th>
                  <th className="text-left font-medium text-foreground px-4 py-3">
                    Name
                  </th>
                  <th className="text-left font-medium text-foreground px-4 py-3 whitespace-nowrap">
                    Date created
                  </th>
                  <th className="text-left font-medium text-foreground px-4 py-3 whitespace-nowrap">
                    Date last updated
                  </th>
                  <th className="text-right font-medium text-foreground px-4 py-3 whitespace-nowrap">
                    Purchase price
                  </th>
                  <th className="text-right font-medium text-foreground px-4 py-3">
                    SDE
                  </th>
                  <th className="text-left font-medium text-foreground px-4 py-3">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {deals.map((deal) => {
                  const extraction = deal.latest_analysis?.extracted_json;
                  const name =
                    deal.title || deal.business_name || "Untitled deal";
                  const statusLabel =
                    deal.status && STATUS_LABELS[deal.status.toLowerCase()]
                      ? STATUS_LABELS[deal.status.toLowerCase()]
                      : deal.status ?? "–";
                  return (
                    <tr key={deal.id} className="border-b border-border/40">
                      <td className="px-4 py-3">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="font-mono font-semibold text-primary hover:underline"
                        >
                          {deal.deal_code}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/deals/${deal.id}`}
                          className="font-medium text-foreground hover:underline"
                        >
                          {name}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(deal.created_at)}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground whitespace-nowrap">
                        {formatDate(deal.updated_at)}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                        {formatCurrency(extraction?.askingPrice)}
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground whitespace-nowrap">
                        {extraction?.sde != null
                          ? formatCurrency(extraction.sde)
                          : "–"}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                          {statusLabel}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}


import { DealExtraction } from "@/lib/types";

export interface ScoreBreakdown {
  score: number;
  verdict: string;
  recommendation: "Pursue" | "Re-trade" | "Pass";
}

export function scoreDeal(extraction: DealExtraction): ScoreBreakdown {
  let score = 5; // start neutral

  if (extraction.sde && extraction.askingPrice) {
    const multiple = extraction.askingPrice / extraction.sde;
    if (multiple <= 2.5) score += 2;
    else if (multiple <= 3.5) score += 1;
    else if (multiple > 4.5) score -= 2;
  }

  if (extraction.recurringRevenuePct && extraction.recurringRevenuePct >= 50) {
    score += 1;
  }

  if (
    extraction.customerConcentrationPct !== null &&
    extraction.customerConcentrationPct !== undefined
  ) {
    if (extraction.customerConcentrationPct > 40) score -= 2;
    else if (extraction.customerConcentrationPct > 25) score -= 1;
  }

  let missingSignals = 0;
  if (!extraction.revenue) missingSignals++;
  if (!extraction.sde && !extraction.ebitda) missingSignals++;
  if (!extraction.askingPrice) missingSignals++;

  if (missingSignals >= 2) {
    score -= 1.5;
  }

  score = Math.max(0, Math.min(10, score));

  let verdict: string;
  let recommendation: "Pursue" | "Re-trade" | "Pass";

  if (score >= 8) {
    verdict = "Strong candidate";
    recommendation = "Pursue";
  } else if (score >= 6) {
    verdict = "Pursue with caution";
    recommendation = "Pursue";
  } else if (score >= 4) {
    verdict = "Only if price improves";
    recommendation = "Re-trade";
  } else {
    verdict = "Pass";
    recommendation = "Pass";
  }

  return { score, verdict, recommendation };
}


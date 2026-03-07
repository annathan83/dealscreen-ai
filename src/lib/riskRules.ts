import { DealExtraction, RiskFlag } from "@/lib/types";

let counter = 0;
const nextId = () => `risk-${++counter}`;

export function evaluateRiskFlags(extraction: DealExtraction): RiskFlag[] {
  const risks: RiskFlag[] = [];

  if (extraction.askingPrice && extraction.sde) {
    const multiple = extraction.askingPrice / extraction.sde;
    if (multiple > 4) {
      risks.push({
        id: nextId(),
        title: "High valuation multiple",
        severity: "high",
        explanation: `Asking price implies a ~${multiple.toFixed(
          1
        )}x multiple on cash flow, which is above typical small business ranges.`,
        whyItMatters:
          "Overpaying reduces return on investment and limits room for downside.",
        suggestedNextStep:
          "Validate normalized earnings, assess growth, and consider negotiating price or structure."
      });
    }
  }

  if (!extraction.revenue || !extraction.sde) {
    risks.push({
      id: nextId(),
      title: "Incomplete financials",
      severity: "medium",
      explanation:
        "Key financial metrics like revenue and cash flow are missing or unclear.",
      whyItMatters:
        "Without reliable financials it's hard to price the deal or assess risk.",
      suggestedNextStep:
        "Request at least 3 years of P&Ls, tax returns, and a current year-to-date statement."
    });
  }

  if (
    extraction.customerConcentrationPct !== null &&
    extraction.customerConcentrationPct !== undefined &&
    extraction.customerConcentrationPct > 40
  ) {
    risks.push({
      id: nextId(),
      title: "Customer concentration",
      severity: "high",
      explanation: `One customer appears to represent ~${extraction.customerConcentrationPct}% of revenue.`,
      whyItMatters:
        "Loss of a key customer could materially impact earnings and business value.",
      suggestedNextStep:
        "Understand contract terms, relationship depth, and plans to diversify revenue."
    });
  }

  if (extraction.ownerInvolvement?.toLowerCase().includes("full-time")) {
    risks.push({
      id: nextId(),
      title: "Owner-dependent operations",
      severity: "medium",
      explanation:
        "The current owner appears heavily involved day-to-day in operations.",
      whyItMatters:
        "Transition risk is higher and it may be harder to step back or replace the owner.",
      suggestedNextStep:
        "Clarify key-person dependencies and assess strength of the team beneath the owner."
    });
  }

  if (extraction.risksMentioned && extraction.risksMentioned.length > 0) {
    risks.push(
      ...extraction.risksMentioned.map((text) => ({
        id: nextId(),
        title: "Broker / seller risk mention",
        severity: "medium" as const,
        explanation: text,
        whyItMatters:
          "Self-identified risks can highlight where underwriting should focus.",
        suggestedNextStep:
          "Explore each mentioned risk in more detail with concrete numbers and mitigation plans."
      }))
    );
  }

  if (!extraction.reasonForSale) {
    risks.push({
      id: nextId(),
      title: "Unclear reason for sale",
      severity: "medium",
      explanation: "The seller’s reason for sale isn't clearly described.",
      whyItMatters:
        "Misaligned motivations can surface as hidden issues or surprises post-close.",
      suggestedNextStep:
        "Ask for a direct explanation and look for consistency with the rest of the story."
    });
  }

  return risks;
}


import { z } from "zod";
import { getOpenAIClient } from "@/lib/openai";
import {
  Deal,
  DealAnalysisResult,
  DealExtraction,
  DealInput,
  DealFile
} from "@/lib/types";
import {
  extractionSystemPrompt,
  narrativePrompt,
  brokerQuestionsPromptFromRisks
} from "@/lib/prompts";
import { scoreDeal } from "@/lib/scoring";
import { evaluateRiskFlags } from "@/lib/riskRules";
import { consolidateDealContent } from "@/lib/analysis/consolidateDealContent";
import { env } from "@/lib/config";

const extractionSchema: z.ZodType<DealExtraction> = z.object({
  businessName: z.string().nullish().transform((v) => v ?? undefined),
  industry: z.string().nullish().transform((v) => v ?? undefined),
  subIndustry: z.string().nullish().transform((v) => v ?? undefined),
  location: z.string().nullish().transform((v) => v ?? undefined),
  askingPrice: z.number().nullable().optional(),
  revenue: z.number().nullable().optional(),
  sde: z.number().nullable().optional(),
  ebitda: z.number().nullable().optional(),
  cashFlowLabel: z
    .enum(["SDE", "EBITDA", "Cash Flow", "Unknown"])
    .nullable()
    .optional(),
  employees: z.number().nullable().optional(),
  yearsEstablished: z.number().nullable().optional(),
  rentMonthly: z.number().nullable().optional(),
  rentAnnual: z.number().nullable().optional(),
  inventoryIncluded: z.boolean().nullable().optional(),
  inventoryValue: z.number().nullable().optional(),
  ffAndEIncluded: z.boolean().nullable().optional(),
  realEstateIncluded: z.boolean().nullable().optional(),
  sellerFinancingAvailable: z.boolean().nullable().optional(),
  sellerFinancingNotes: z.string().nullable().optional(),
  reasonForSale: z.string().nullable().optional(),
  customerConcentrationPct: z.number().nullable().optional(),
  recurringRevenuePct: z.number().nullable().optional(),
  ownerInvolvement: z.string().nullable().optional(),
  growthClaims: z.array(z.string()).optional().default([]),
  addBacksMentioned: z.array(z.string()).optional().default([]),
  risksMentioned: z.array(z.string()).optional().default([]),
  notes: z.array(z.string()).optional().default([]),
  unknowns: z.array(z.string()).optional().default([]),
  extractionConfidence: z
    .enum(["high", "medium", "low"])
    .optional(),
  confidenceNotes: z.array(z.string()).optional().default([])
});

async function runExtraction(
  deal: Deal,
  text: string
): Promise<DealExtraction> {
  const client = getOpenAIClient();

  const response = await client.chat.completions.create({
    model: env.DEALHUB_OPENAI_MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: extractionSystemPrompt
      },
      {
        role: "user",
        content: `Deal code: ${deal.deal_code}\n\nConsolidated deal text:\n\n${text}`
      }
    ],
    temperature: 0.1,
    max_tokens: 1200
  });

  const raw = response.choices[0]?.message?.content ?? "{}";

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    parsed = {};
  }

  return extractionSchema.parse(parsed);
}

async function runNarrative(
  extraction: DealExtraction
): Promise<string> {
  const client = getOpenAIClient();

  const descriptionLines = [
    `Industry: ${extraction.industry ?? "Unknown"}`,
    `Location: ${extraction.location ?? "Unknown"}`,
    `Asking price: ${extraction.askingPrice ?? "Unknown"}`,
    `SDE: ${extraction.sde ?? "Unknown"}`,
    `EBITDA: ${extraction.ebitda ?? "Unknown"}`
  ].join("\n");

  const response = await client.chat.completions.create({
    model: env.DEALHUB_OPENAI_MODEL,
    messages: [
      { role: "system", content: narrativePrompt },
      {
        role: "user",
        content: `Short description of extracted numbers:\n${descriptionLines}`
      }
    ],
    temperature: 0.4,
    max_tokens: 600
  });

  return response.choices[0]?.message?.content ?? "";
}

async function runBrokerQuestions(
  extraction: DealExtraction,
  risks: ReturnType<typeof evaluateRiskFlags>
): Promise<string[]> {
  const client = getOpenAIClient();

  const prompt = brokerQuestionsPromptFromRisks(extraction, risks);

  const response = await client.chat.completions.create({
    model: env.DEALHUB_OPENAI_MODEL,
    messages: [
      { role: "system", content: "You write concise, practical broker questions." },
      { role: "user", content: prompt }
    ],
    temperature: 0.4,
    max_tokens: 500
  });

  const text = response.choices[0]?.message?.content ?? "";
  return text
    .split(/\n+/)
    .map((line) => line.replace(/^\d+[\).\s-]*/, "").trim())
    .filter(Boolean);
}

export async function runDealAnalysis(
  deal: Deal,
  inputs: DealInput[],
  files: DealFile[]
): Promise<DealAnalysisResult> {
  const consolidated = consolidateDealContent(inputs, files);

  const extraction = await runExtraction(deal, consolidated);

  const base = scoreDeal(extraction);
  const riskFlags = evaluateRiskFlags(extraction);
  const narrativeText = await runNarrative(extraction);
  const brokerQuestionsText = await runBrokerQuestions(extraction, riskFlags);

  const result: DealAnalysisResult = {
    extraction,
    score: base.score,
    verdict: base.verdict,
    recommendation: base.recommendation,
    riskFlags,
    brokerQuestions: brokerQuestionsText.map((q, idx) => ({
      id: `q-${idx + 1}`,
      question: q,
      rationale: ""
    })),
    narrative: {
      overview: narrativeText,
      strengths: [],
      weaknesses: []
    },
    assumptions: []
  };

  return result;
}


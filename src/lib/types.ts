// Database types (align with Supabase schema; adapt if needed)

export type UUID = string;

export interface Deal {
  id: UUID;
  user_id: UUID;
  deal_code: string;
  title: string | null;
  business_name: string | null;
  industry: string | null;
  location: string | null;
  source: string | null;
  status: string | null;
  drive_folder_id: string | null;
  drive_folder_url: string | null;
  created_at: string;
  updated_at: string | null;
}

export type DealInputType =
  | "listing_text"
  | "broker_email"
  | "note"
  | "manual_summary"
  | "snippet";

export interface DealInput {
  id: UUID;
  deal_id: UUID;
  user_id: UUID;
  input_type: DealInputType;
  title: string | null;
  content: string;
  created_at: string;
}

export interface DealFile {
  id: UUID;
  deal_id: UUID;
  user_id: UUID;
  file_name: string;
  mime_type: string | null;
  storage_provider: string | null;
  external_url: string | null;
  drive_file_id: string | null;
  created_at: string;
}

export interface RiskFlag {
  id: string;
  title: string;
  severity: "low" | "medium" | "high" | "critical";
  explanation: string;
  whyItMatters: string;
  suggestedNextStep: string;
}

export interface BrokerQuestion {
  id: string;
  question: string;
  rationale: string;
}

export interface NarrativeSummary {
  overview: string;
  strengths: string[];
  weaknesses: string[];
  keyNumbersSummary?: string;
  verificationChecklist?: string[];
}

export interface AssumptionSet {
  label: string;
  notes: string[];
}

export type CashFlowLabel =
  | "SDE"
  | "EBITDA"
  | "Cash Flow"
  | "Unknown"
  | null;

export type ExtractionConfidence = "high" | "medium" | "low";

export interface DealExtraction {
  businessName?: string;
  industry?: string;
  subIndustry?: string;
  location?: string;
  askingPrice?: number | null;
  revenue?: number | null;
  sde?: number | null;
  ebitda?: number | null;
  cashFlowLabel?: CashFlowLabel;
  employees?: number | null;
  yearsEstablished?: number | null;
  rentMonthly?: number | null;
  rentAnnual?: number | null;
  inventoryIncluded?: boolean | null;
  inventoryValue?: number | null;
  ffAndEIncluded?: boolean | null;
  realEstateIncluded?: boolean | null;
  sellerFinancingAvailable?: boolean | null;
  sellerFinancingNotes?: string | null;
  reasonForSale?: string | null;
  customerConcentrationPct?: number | null;
  recurringRevenuePct?: number | null;
  ownerInvolvement?: string | null;
  growthClaims?: string[];
  addBacksMentioned?: string[];
  risksMentioned?: string[];
  notes?: string[];
  unknowns?: string[];
  extractionConfidence?: ExtractionConfidence;
  confidenceNotes?: string[];
}

export interface DealAnalysisResult {
  extraction: DealExtraction;
  score: number;
  verdict: string;
  recommendation: "Pursue" | "Re-trade" | "Pass";
  riskFlags: RiskFlag[];
  brokerQuestions: BrokerQuestion[];
  narrative: NarrativeSummary;
  assumptions?: AssumptionSet[];
}

export interface DealAnalysisRow {
  id: UUID;
  deal_id: UUID;
  user_id: UUID;
  extracted_json: DealExtraction | null;
  analysis_json: DealAnalysisResult | null;
  score: number | null;
  verdict: string | null;
  recommendation: string | null;
  created_at: string;
}

export interface DealChangelogRow {
  id: string;
  user_id: string;
  deal_id: string | null;
  action: string;
  details: Record<string, unknown> | null;
  created_at: string;
}

// Minimal Supabase typed client Database definition (extend as needed)
export interface Database {
  public: {
    Tables: {
      deal_changelog: {
        Row: DealChangelogRow;
        Insert: Omit<DealChangelogRow, "id" | "created_at"> & { id?: string; created_at?: string };
        Update: Partial<DealChangelogRow>;
      };
      deals: {
        Row: Deal;
        Insert: Partial<Deal> & { user_id: UUID; deal_code: string };
        Update: Partial<Deal>;
      };
      deal_inputs: {
        Row: DealInput;
        Insert: Omit<DealInput, "id" | "created_at">;
        Update: Partial<DealInput>;
      };
      deal_files: {
        Row: DealFile;
        Insert: Omit<DealFile, "id" | "created_at">;
        Update: Partial<DealFile>;
      };
      deal_analyses: {
        Row: DealAnalysisRow;
        Insert: Omit<DealAnalysisRow, "id" | "created_at">;
        Update: Partial<DealAnalysisRow>;
      };
      user_drive_settings: {
        Row: {
          user_id: UUID;
          drive_refresh_token: string;
          root_folder_id: string | null;
          root_folder_name: string | null;
          root_folder_url: string | null;
          created_at: string;
          updated_at: string | null;
        };
        Insert: {
          user_id: UUID;
          drive_refresh_token: string;
          root_folder_id?: string | null;
          root_folder_name?: string | null;
          root_folder_url?: string | null;
        };
        Update: Partial<Database["public"]["Tables"]["user_drive_settings"]["Row"]>;
      };
    };
  };
}


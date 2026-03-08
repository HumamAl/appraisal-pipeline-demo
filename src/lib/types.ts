import type { LucideIcon } from "lucide-react";

// ─── Navigation ──────────────────────────────────────────────────────────────

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

// ─── Challenge & Proposal (Tab 2 / Tab 3) ────────────────────────────────────

export type VisualizationType =
  | "flow"
  | "before-after"
  | "metrics"
  | "architecture"
  | "risk-matrix"
  | "timeline"
  | "dual-kpi"
  | "tech-stack"
  | "decision-flow";

export interface Challenge {
  id: string;
  title: string;
  description: string;
  visualizationType: VisualizationType;
  outcome?: string;
}

export interface Profile {
  name: string;
  tagline: string;
  bio: string;
  approach: { title: string; description: string }[];
  skillCategories: { name: string; skills: string[] }[];
}

export interface PortfolioProject {
  id: string;
  title: string;
  description: string;
  tech: string[];
  relevance?: string;
  outcome?: string;
  liveUrl?: string;
}

export interface DemoScreen {
  id: string;
  label: string;
  icon?: LucideIcon;
  href: string;
}

export type ConversionVariant = "sidebar" | "inline" | "floating" | "banner";

// ─── Appraisal Domain Types ───────────────────────────────────────────────────

export type AppraisalOrderStatus =
  | "Queued"
  | "Running"
  | "Completed"
  | "Failed"
  | "Needs Review";

export type LoanPurpose =
  | "Purchase"
  | "Refinance"
  | "Cash-Out Refinance"
  | "HELOC";

export type PropertyType = "SFR" | "Condo" | "Townhouse" | "2-Unit" | "PUD";

/** FNMA condition rating: C1 (excellent) through C6 (poor) */
export type ConditionCode = "C1" | "C2" | "C3" | "C4" | "C5" | "C6";

/** FNMA quality rating: Q1 (luxury) through Q6 (economy) */
export type QualityCode = "Q1" | "Q2" | "Q3" | "Q4" | "Q5" | "Q6";

export type PipelinePhaseStatus =
  | "Pending"
  | "Running"
  | "Completed"
  | "Failed"
  | "Cached"
  | "Skipped";

export type ErrorSeverity = "info" | "warning" | "error" | "critical";

// ─── Core Entities ────────────────────────────────────────────────────────────

export interface AppraisalOrder {
  orderId: string;
  status: AppraisalOrderStatus;
  subjectAddress: string;
  city: string;
  state: string;
  zip: string;
  propertyType: PropertyType;
  loanPurpose: LoanPurpose;
  lenderName: string;
  assignedAnalyst: string;
  orderDate: string;
  completedDate: string | null;
  /** Estimated market value in USD */
  estimatedValue: number | null;
  /** Model confidence score 0–100 */
  confidence: number | null;
  /** Forecast Standard Deviation — flag if > 0.20 */
  fsd: number | null;
  /** True when confidence < 60 or fsd > 0.20 */
  flagged: boolean;
  flagReason?: string;
}

export interface PipelinePhase {
  phaseId: string;
  name:
    | "Data Ingestion"
    | "Enrichment"
    | "Geocoding"
    | "Feature Extraction"
    | "Image Analysis"
    | "AVM Modeling"
    | "Comp Selection"
    | "Narrative Generation";
  status: PipelinePhaseStatus;
  startedAt: string | null;
  completedAt: string | null;
  /** Duration in seconds */
  duration: number | null;
  cached: boolean;
  errorMessage: string | null;
}

export interface PipelineRun {
  runId: string;
  orderId: string;
  startedAt: string;
  completedAt: string | null;
  /** Total elapsed seconds */
  totalDuration: number | null;
  phases: PipelinePhase[];
}

export interface SubjectProperty {
  orderId: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  lat: number;
  lng: number;
  /** Gross Living Area in sq ft */
  gla: number;
  /** Lot size in sq ft */
  lotSize: number;
  bedrooms: number;
  bathrooms: number;
  yearBuilt: number;
  propertyType: PropertyType;
  conditionCode: ConditionCode;
  qualityCode: QualityCode;
  mlsId: string | null;
  listPrice: number | null;
}

export interface ComparableSale {
  compId: string;
  orderId: string;
  address: string;
  salePrice: number;
  saleDate: string;
  gla: number;
  /** GLA adjustment in USD */
  glaAdj: number;
  lotSizeAdj: number;
  conditionAdj: number;
  bathroomAdj: number;
  garageAdj: number;
  /** Time/market conditions adjustment */
  timeAdj: number;
  /** Net dollar adjustment */
  netAdj: number;
  /** Gross adjustment as a percentage of sale price — flag if > 25% */
  grossAdjPct: number;
  adjustedValue: number;
  /** 0–1 similarity score — flag if < 0.70 */
  similarityScore: number;
  /** Distance from subject in miles */
  distance: number;
  /** Whether this comp was included in final reconciliation */
  selected: boolean;
  flagged: boolean;
  flagReason?: string;
}

export interface ValuationResult {
  orderId: string;
  estimatedValue: number;
  valueRangeLow: number;
  valueRangeHigh: number;
  /** Model confidence 0–100 */
  confidence: number;
  fsd: number;
  /** Final reconciled value after analyst review */
  reconciledValue: number;
  narrativeExcerpt: string;
}

export interface ErrorLog {
  errorId: string;
  orderId: string;
  phaseId: string;
  severity: ErrorSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

// ─── Dashboard / Analytics Types ─────────────────────────────────────────────

export interface DashboardStats {
  /** Total appraisal orders in the current period */
  totalOrders: number;
  ordersChange: number;
  /** Average AVM confidence score across completed orders */
  avgConfidence: number;
  confidenceChange: number;
  /** Percentage of orders completed without analyst intervention */
  straightThroughRate: number;
  straightThroughChange: number;
  /** Average pipeline run duration in minutes */
  avgTurnaroundMin: number;
  turnaroundChange: number;
  /** Orders currently flagged for review */
  pendingReview: number;
  pendingReviewChange: number;
  /** AVM model hit rate — orders where AVM returned a value */
  hitRate: number;
  hitRateChange: number;
}

export interface MonthlyMetrics {
  month: string;
  orderVolume: number;
  avgConfidence: number;
  /** AVM hit rate percentage */
  hitRate: number;
  avgTurnaroundMin: number;
  /** Percentage of orders completed without analyst intervention */
  completionRate: number;
}

export interface ChartDataPoint {
  month: string;
  value: number;
  target?: number;
}

export interface PhaseDurationBreakdown {
  phase: string;
  avgDurationSec: number;
  p95DurationSec: number;
}

export interface ConfidenceDistribution {
  range: string;
  count: number;
  percentage: number;
}

export interface PropertyTypeBreakdown {
  type: PropertyType;
  count: number;
  avgConfidence: number;
}

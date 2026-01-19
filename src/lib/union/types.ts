/**
 * Union data types for UPS Teamster contract retrieval.
 *
 * These types model the hierarchical structure of union contracts:
 * - Master Agreement applies to all
 * - Supplements cover regional areas
 * - Riders provide additional local-specific provisions
 */

/**
 * Job classifications from the UPS Teamster contract.
 * Each classification may have different contract provisions that apply.
 */
export type Classification =
  | "rpcd" // Regular Package Car Driver
  | "feeder" // Feeder Driver
  | "pt-hub" // Part-Time Hub/Sort
  | "22.3" // 22.3 Combination (full-time inside)
  | "22.4" // 22.4 Driver (hybrid driver)
  | "air" // Air Driver
  | "automotive" // Automotive/Mechanic
  | "clerical" // Clerical
  | "other"; // Other (freeform)

/**
 * Display information for each classification.
 */
export interface ClassificationInfo {
  id: Classification;
  label: string;
  description: string;
}

/**
 * Geographic regions for supplement organization.
 */
export type Region =
  | "western"
  | "central"
  | "eastern"
  | "atlantic"
  | "southern";

/**
 * Types of contract documents.
 */
export type DocumentType =
  | "master" // National Master Agreement
  | "supplement" // Regional supplement
  | "rider" // Local/area rider
  | "local" // Standalone local agreement
  | "mou"; // Memorandum of Understanding

/**
 * A contract document (supplement, rider, or local agreement).
 */
export interface Supplement {
  id: string;
  name: string;
  shortName: string;
  type: DocumentType;
  description?: string;
}

/**
 * The chain of documents that apply to a specific Local.
 */
export interface SupplementChain {
  region: Region;
  supplements: string[]; // Supplement IDs
  riders: string[]; // Rider IDs
}

/**
 * Information about a Local union.
 */
export interface Local {
  number: number;
  name: string;
  city: string;
  state: string;
  region: Region;
}

/**
 * Search result for Local unions.
 */
export interface LocalSearchResult extends Local {
  displayName: string;
  matchScore: number;
}

/**
 * User's union profile data for onboarding/settings forms.
 */
export interface UnionProfileData {
  localNumber: string;
  classification: Classification;
  classificationOther?: string;
}

/**
 * The complete set of documents applicable to a user.
 */
export interface ApplicableDocuments {
  master: Supplement;
  supplements: Supplement[];
  riders: Supplement[];
  all: Supplement[];
}

/**
 * Union data module for UPS Teamster contract retrieval.
 *
 * This module provides:
 * - Type definitions for Locals, classifications, and supplements
 * - Data for ~200 Local unions across all regions
 * - Mapping logic to determine applicable documents for each Local
 * - Client-side search utilities for Local selection
 * - Zod validation schemas for forms
 */

// Types
export type {
  Classification,
  ClassificationInfo,
  Region,
  DocumentType,
  Supplement,
  SupplementChain,
  Local,
  LocalSearchResult,
  UnionProfileData,
  ApplicableDocuments,
} from "./types";

// Classifications
export {
  CLASSIFICATIONS,
  getClassificationInfo,
  getClassificationLabel,
  isValidClassification,
  requiresOtherText,
} from "./classifications";

// Supplements
export {
  MASTER_AGREEMENT,
  SUPPLEMENTS,
  RIDERS,
  getSupplement,
  getRider,
  getDocument,
  getAllDocumentIds,
} from "./supplements";

// Locals
export {
  LOCALS,
  getLocalsByRegion,
  getLocalByNumber,
  getAllStates,
  formatLocalDisplay,
} from "./locals";

// Mapping (Local → Documents)
export {
  getSupplementChain,
  getDocumentScope,
  getApplicableDocuments,
  getSupplementIds,
  hasExplicitMapping,
} from "./mapping";

// Search
export {
  searchLocals,
  getAllLocalsForDisplay,
  getSuggestedLocals,
  isValidLocalNumber,
  getAutocompleteSuggestions,
} from "./search";

// Validation
export {
  classificationSchema,
  localNumberSchema,
  classificationOtherSchema,
  onboardingFormSchema,
  onboardingActionSchema,
  settingsFormSchema,
  validateOnboardingForm,
  type OnboardingFormData,
  type OnboardingActionInput,
  type SettingsFormData,
} from "./validation";

// User Context (for AI responses)
export {
  buildUserContext,
  buildContextHeader,
  type UserContext,
} from "./user-context";

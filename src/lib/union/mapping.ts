import type { ApplicableDocuments, Region, SupplementChain } from "./types";
import { getLocalByNumber } from "./locals";
import { MASTER_AGREEMENT, getDocument } from "./supplements";

/**
 * Mapping of Local numbers to their supplement chains.
 *
 * Most Locals follow their region's standard supplement, but some have:
 * - Standalone agreements (705, 710, 804)
 * - Additional riders on top of their regional supplement
 *
 * This mapping is the source of truth for determining which documents
 * apply to a user based on their Local union number.
 */
const LOCAL_SUPPLEMENT_MAP: Record<number, SupplementChain> = {
  // ═══════════════════════════════════════════════════════════════════════════
  // STANDALONE LOCALS (have their own supplement instead of regional)
  // ═══════════════════════════════════════════════════════════════════════════
  705: { region: "central", supplements: ["local-705"], riders: [] },
  710: { region: "central", supplements: ["local-710"], riders: [] },
  804: { region: "eastern", supplements: ["local-804"], riders: [] },

  // ═══════════════════════════════════════════════════════════════════════════
  // WESTERN REGION WITH RIDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Northern California Rider
  63: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  70: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  150: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  287: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  315: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  350: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  386: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  492: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  601: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  853: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  856: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  890: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },
  912: {
    region: "western",
    supplements: ["western"],
    riders: ["northern-california"],
  },

  // Southern California Rider
  166: {
    region: "western",
    supplements: ["western"],
    riders: ["southern-california"],
  },
  396: {
    region: "western",
    supplements: ["western"],
    riders: ["southwest-package"],
  },
  399: {
    region: "western",
    supplements: ["western"],
    riders: ["southern-california"],
  },
  481: {
    region: "western",
    supplements: ["western"],
    riders: ["southern-california"],
  },
  542: {
    region: "western",
    supplements: ["western"],
    riders: ["southwest-package"],
  },
  572: {
    region: "western",
    supplements: ["western"],
    riders: ["southern-california"],
  },
  630: {
    region: "western",
    supplements: ["western"],
    riders: ["southern-california"],
  },
  848: {
    region: "western",
    supplements: ["western"],
    riders: ["southern-california"],
  },
  986: {
    region: "western",
    supplements: ["western"],
    riders: ["southern-california"],
  },

  // Southwest Package Rider (AZ, NV, etc.)
  14: {
    region: "western",
    supplements: ["western"],
    riders: ["southwest-package"],
  },
  104: {
    region: "western",
    supplements: ["western"],
    riders: ["southwest-package"],
  },
  274: {
    region: "western",
    supplements: ["western"],
    riders: ["southwest-package"],
  },
  533: {
    region: "western",
    supplements: ["western"],
    riders: ["southwest-package"],
  },
  631: {
    region: "western",
    supplements: ["western"],
    riders: ["southwest-package"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // EASTERN REGION WITH RIDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // New England Rider
  25: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  170: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  251: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  340: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  379: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  404: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  597: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  633: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  653: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },
  671: { region: "eastern", supplements: ["eastern"], riders: ["new-england"] },

  // Upstate NY Rider
  118: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },
  182: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },
  264: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },
  294: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },
  317: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },
  449: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },
  529: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },
  687: { region: "eastern", supplements: ["eastern"], riders: ["upstate-ny"] },

  // ═══════════════════════════════════════════════════════════════════════════
  // CENTRAL REGION WITH RIDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Ohio Valley Rider
  20: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  40: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  92: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  100: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  114: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  244: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  284: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  377: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  407: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  413: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  416: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  436: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  480: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  507: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  637: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },
  957: { region: "central", supplements: ["central"], riders: ["ohio-valley"] },

  // Michigan-Indiana Rider
  135: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana", "local-135"],
  },
  142: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  215: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  243: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana", "local-243"],
  },
  247: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  283: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  299: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  332: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  337: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  339: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  364: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  406: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },
  414: {
    region: "central",
    supplements: ["central"],
    riders: ["michigan-indiana"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOUTHERN REGION WITH RIDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Texas Rider
  19: { region: "southern", supplements: ["southern"], riders: ["texas"] },
  47: { region: "southern", supplements: ["southern"], riders: ["texas"] },
  577: { region: "southern", supplements: ["southern"], riders: ["texas"] },
  657: { region: "southern", supplements: ["southern"], riders: ["texas"] },
  745: { region: "southern", supplements: ["southern"], riders: ["texas"] },
  767: { region: "southern", supplements: ["southern"], riders: ["texas"] },
  988: { region: "southern", supplements: ["southern"], riders: ["texas"] },

  // ═══════════════════════════════════════════════════════════════════════════
  // ATLANTIC REGION WITH RIDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Local 177 Riders (New Jersey)
  177: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["local-177-drivers", "local-177-mechanics"],
  },

  // Central PA Locals
  229: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["central-pa"],
  },
  401: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["central-pa"],
  },
  764: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["central-pa"],
  },

  // Western PA Locals
  169: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["western-pa"],
  },
  249: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["western-pa"],
  },
  430: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["western-pa"],
  },
  771: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["western-pa"],
  },

  // Metro Philadelphia Locals
  107: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["metro-philadelphia"],
  },
  115: {
    region: "atlantic",
    supplements: ["atlantic"],
    riders: ["metro-philadelphia"],
  },

  // Local 623 (Philadelphia)
  623: { region: "atlantic", supplements: ["atlantic"], riders: ["local-623"] },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOUTHERN REGION ADDITIONAL RIDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Local 89 Louisville Air
  89: {
    region: "southern",
    supplements: ["southern"],
    riders: ["local-89-louisville-air"],
  },

  // Local 769 Latin America (Miami)
  769: {
    region: "southern",
    supplements: ["southern"],
    riders: ["local-769-latin-america"],
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WESTERN REGION ADDITIONAL RIDERS
  // ═══════════════════════════════════════════════════════════════════════════

  // Local 959 Alaska
  959: {
    region: "western",
    supplements: ["western"],
    riders: ["local-959-alaska"],
  },

  // Local 996 Hawaii
  996: {
    region: "western",
    supplements: ["western"],
    riders: ["local-996-hawaii"],
  },
};

/**
 * Default supplement chains by region (for Locals not explicitly mapped).
 */
const DEFAULT_REGION_CHAINS: Record<Region, SupplementChain> = {
  western: { region: "western", supplements: ["western"], riders: [] },
  central: { region: "central", supplements: ["central"], riders: [] },
  eastern: { region: "eastern", supplements: ["eastern"], riders: [] },
  atlantic: { region: "atlantic", supplements: ["atlantic"], riders: [] },
  southern: { region: "southern", supplements: ["southern"], riders: [] },
};

/**
 * Get the supplement chain for a Local number.
 *
 * @param localNumber - The Local union number
 * @returns The supplement chain, or a default based on region
 */
export function getSupplementChain(
  localNumber: number,
): SupplementChain | null {
  // First check explicit mapping
  const explicit = LOCAL_SUPPLEMENT_MAP[localNumber];
  if (explicit) {
    return explicit;
  }

  // Fall back to region-based default
  const local = getLocalByNumber(localNumber);
  if (local) {
    return DEFAULT_REGION_CHAINS[local.region];
  }

  // Unknown Local - return null
  return null;
}

/**
 * Get all document IDs that apply to a Local.
 *
 * @param localNumber - The Local union number
 * @returns Array of document IDs (master + supplements + riders)
 */
export function getDocumentScope(localNumber: number): string[] {
  const chain = getSupplementChain(localNumber);
  if (!chain) {
    // Unknown Local - master only
    return ["master"];
  }
  return ["master", ...chain.supplements, ...chain.riders];
}

/**
 * Get full document details for a Local.
 *
 * @param localNumber - The Local union number
 * @returns Object containing all applicable documents with full details
 */
export function getApplicableDocuments(
  localNumber: number,
): ApplicableDocuments {
  const chain = getSupplementChain(localNumber);

  const supplements =
    chain?.supplements.map((id) => getDocument(id)).filter(Boolean) ?? [];
  const riders =
    chain?.riders.map((id) => getDocument(id)).filter(Boolean) ?? [];

  return {
    master: MASTER_AGREEMENT,
    supplements: supplements as ApplicableDocuments["supplements"],
    riders: riders as ApplicableDocuments["riders"],
    all: [
      MASTER_AGREEMENT,
      ...supplements,
      ...riders,
    ] as ApplicableDocuments["all"],
  };
}

/**
 * Get supplement IDs as an array for database storage.
 *
 * @param localNumber - The Local union number
 * @returns Array of supplement IDs to store in user_profiles.supplement_ids
 */
export function getSupplementIds(localNumber: number): string[] {
  return getDocumentScope(localNumber);
}

/**
 * Check if a Local has explicit mapping or uses regional default.
 */
export function hasExplicitMapping(localNumber: number): boolean {
  return localNumber in LOCAL_SUPPLEMENT_MAP;
}

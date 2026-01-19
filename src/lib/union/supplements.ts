import type { Supplement } from "./types";

/**
 * The National Master Agreement - applies to all UPS Teamsters.
 */
export const MASTER_AGREEMENT: Supplement = {
  id: "master",
  name: "National Master UPS Agreement",
  shortName: "Master Agreement",
  type: "master",
  description: "The primary collective bargaining agreement covering all UPS Teamsters nationwide",
};

/**
 * All regional supplements.
 */
export const SUPPLEMENTS: Record<string, Supplement> = {
  western: {
    id: "western",
    name: "Western Region of Teamsters United Parcel Service Supplemental Agreement",
    shortName: "Western Supplement",
    type: "supplement",
    description: "Covers California, Oregon, Washington, Nevada, Arizona, Colorado, Utah, New Mexico, Wyoming, Montana, Idaho, Hawaii, and Alaska",
  },
  central: {
    id: "central",
    name: "Central Region of Teamsters and United Parcel Service Supplemental Agreement",
    shortName: "Central Supplement",
    type: "supplement",
    description: "Covers Illinois, Indiana, Ohio, Michigan, Wisconsin, Minnesota, Iowa, Missouri, Kansas, Nebraska, North Dakota, and South Dakota",
  },
  southern: {
    id: "southern",
    name: "Southern Region of Teamsters and United Parcel Service Supplemental Agreement",
    shortName: "Southern Supplement",
    type: "supplement",
    description: "Covers Texas, Louisiana, Arkansas, Oklahoma, Mississippi, Alabama, Tennessee, and Kentucky",
  },
  atlantic: {
    id: "atlantic",
    name: "Atlantic Area Teamsters and United Parcel Service Supplemental Agreement",
    shortName: "Atlantic Supplement",
    type: "supplement",
    description: "Covers Pennsylvania, New Jersey, Delaware, Maryland, Virginia, West Virginia, and Washington D.C.",
  },
  eastern: {
    id: "eastern",
    name: "Eastern Region of Teamsters United Parcel Service Supplemental Agreement",
    shortName: "Eastern Supplement",
    type: "supplement",
    description: "Covers New York (outside 804), Connecticut, Massachusetts, New Hampshire, Vermont, Maine, and Rhode Island",
  },
  // Standalone local agreements (treated as supplements)
  "local-804": {
    id: "local-804",
    name: "Local 804 and United Parcel Service Supplemental Agreement",
    shortName: "Local 804 Agreement",
    type: "local",
    description: "Standalone agreement for Local 804 (NYC metropolitan area)",
  },
  "local-705": {
    id: "local-705",
    name: "Local 705 and United Parcel Service Supplemental Agreement",
    shortName: "Local 705 Agreement",
    type: "local",
    description: "Standalone agreement for Local 705 (Chicago metropolitan area)",
  },
  "local-710": {
    id: "local-710",
    name: "Local 710 and United Parcel Service Supplemental Agreement",
    shortName: "Local 710 Agreement",
    type: "local",
    description: "Standalone agreement for Local 710 (Chicago area)",
  },
};

/**
 * All riders (local or area-specific provisions within a supplement region).
 */
export const RIDERS: Record<string, Supplement> = {
  "southwest-package": {
    id: "southwest-package",
    name: "Southwest Package Rider",
    shortName: "SW Package Rider",
    type: "rider",
    description: "Additional provisions for select Western Region locals",
  },
  "northern-california": {
    id: "northern-california",
    name: "Northern California Rider",
    shortName: "NorCal Rider",
    type: "rider",
    description: "Additional provisions for Northern California locals",
  },
  "southern-california": {
    id: "southern-california",
    name: "Southern California Rider",
    shortName: "SoCal Rider",
    type: "rider",
    description: "Additional provisions for Southern California locals",
  },
  "new-england": {
    id: "new-england",
    name: "New England Rider",
    shortName: "New England Rider",
    type: "rider",
    description: "Additional provisions for New England locals",
  },
  "upstate-ny": {
    id: "upstate-ny",
    name: "Upstate New York Rider",
    shortName: "Upstate NY Rider",
    type: "rider",
    description: "Additional provisions for upstate New York locals",
  },
  texas: {
    id: "texas",
    name: "Texas Rider",
    shortName: "Texas Rider",
    type: "rider",
    description: "Additional provisions for Texas locals",
  },
  "ohio-valley": {
    id: "ohio-valley",
    name: "Ohio Valley Rider",
    shortName: "Ohio Valley Rider",
    type: "rider",
    description: "Additional provisions for Ohio Valley locals",
  },
  "michigan-indiana": {
    id: "michigan-indiana",
    name: "Michigan-Indiana Rider",
    shortName: "MI-IN Rider",
    type: "rider",
    description: "Additional provisions for Michigan and Indiana locals",
  },
};

/**
 * Get a supplement by ID.
 */
export function getSupplement(id: string): Supplement | undefined {
  return SUPPLEMENTS[id];
}

/**
 * Get a rider by ID.
 */
export function getRider(id: string): Supplement | undefined {
  return RIDERS[id];
}

/**
 * Get any document (master, supplement, or rider) by ID.
 */
export function getDocument(id: string): Supplement | undefined {
  if (id === "master") return MASTER_AGREEMENT;
  return SUPPLEMENTS[id] ?? RIDERS[id];
}

/**
 * Get all supplement and rider IDs.
 */
export function getAllDocumentIds(): string[] {
  return ["master", ...Object.keys(SUPPLEMENTS), ...Object.keys(RIDERS)];
}

import type { Supplement } from "./types";

/**
 * The National Master Agreement - applies to all UPS Teamsters.
 */
export const MASTER_AGREEMENT: Supplement = {
  id: "master",
  name: "National Master UPS Agreement",
  shortName: "Master Agreement",
  type: "master",
  description:
    "The primary collective bargaining agreement covering all UPS Teamsters nationwide",
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
    description:
      "Covers California, Oregon, Washington, Nevada, Arizona, Colorado, Utah, New Mexico, Wyoming, Montana, Idaho, Hawaii, and Alaska",
  },
  central: {
    id: "central",
    name: "Central Region of Teamsters and United Parcel Service Supplemental Agreement",
    shortName: "Central Supplement",
    type: "supplement",
    description:
      "Covers Illinois, Indiana, Ohio, Michigan, Wisconsin, Minnesota, Iowa, Missouri, Kansas, Nebraska, North Dakota, and South Dakota",
  },
  southern: {
    id: "southern",
    name: "Southern Region of Teamsters and United Parcel Service Supplemental Agreement",
    shortName: "Southern Supplement",
    type: "supplement",
    description:
      "Covers Texas, Louisiana, Arkansas, Oklahoma, Mississippi, Alabama, Tennessee, and Kentucky",
  },
  atlantic: {
    id: "atlantic",
    name: "Atlantic Area Teamsters and United Parcel Service Supplemental Agreement",
    shortName: "Atlantic Supplement",
    type: "supplement",
    description:
      "Covers Pennsylvania, New Jersey, Delaware, Maryland, Virginia, West Virginia, and Washington D.C.",
  },
  eastern: {
    id: "eastern",
    name: "Eastern Region of Teamsters United Parcel Service Supplemental Agreement",
    shortName: "Eastern Supplement",
    type: "supplement",
    description:
      "Covers New York (outside 804), Connecticut, Massachusetts, New Hampshire, Vermont, Maine, and Rhode Island",
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
    description:
      "Standalone agreement for Local 705 (Chicago metropolitan area)",
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
  "local-177-drivers": {
    id: "local-177-drivers",
    name: "Local 177 Drivers Rider",
    shortName: "Local 177 Drivers",
    type: "rider",
    description: "Additional provisions for Local 177 drivers (New Jersey)",
  },
  "local-177-mechanics": {
    id: "local-177-mechanics",
    name: "Local 177 Mechanics Rider",
    shortName: "Local 177 Mechanics",
    type: "rider",
    description: "Additional provisions for Local 177 mechanics (New Jersey)",
  },

  // Atlantic region riders
  "central-pa": {
    id: "central-pa",
    name: "Central Pennsylvania Supplemental Agreement",
    shortName: "Central PA",
    type: "rider",
    description: "Additional provisions for Central Pennsylvania locals",
  },
  "western-pa": {
    id: "western-pa",
    name: "Western Pennsylvania Supplemental Agreement",
    shortName: "Western PA",
    type: "rider",
    description: "Additional provisions for Western Pennsylvania locals",
  },
  "metro-philadelphia": {
    id: "metro-philadelphia",
    name: "Metro Philadelphia Supplemental Agreement",
    shortName: "Metro Philly",
    type: "rider",
    description: "Additional provisions for Metro Philadelphia locals",
  },
  "local-623": {
    id: "local-623",
    name: "Local 623 Supplemental Agreement",
    shortName: "Local 623",
    type: "rider",
    description: "Additional provisions for Local 623 (Philadelphia)",
  },

  // Central region riders
  "local-243": {
    id: "local-243",
    name: "Local 243 Metro Detroit Supplemental Agreement",
    shortName: "Local 243 Detroit",
    type: "rider",
    description: "Additional provisions for Local 243 (Detroit)",
  },
  "local-135": {
    id: "local-135",
    name: "Local 135 Rider",
    shortName: "Local 135",
    type: "rider",
    description: "Additional provisions for Local 135 (Indianapolis)",
  },

  // Southern region riders
  "local-89-louisville-air": {
    id: "local-89-louisville-air",
    name: "Local 89 Louisville Air Rider",
    shortName: "Local 89 Air",
    type: "rider",
    description: "Additional provisions for Local 89 Louisville Air operations",
  },
  "local-769-latin-america": {
    id: "local-769-latin-america",
    name: "Local 769 Latin America Inc Rider",
    shortName: "Local 769 Latin America",
    type: "rider",
    description: "Additional provisions for Local 769 Latin America operations",
  },

  // Western region riders
  "local-959-alaska": {
    id: "local-959-alaska",
    name: "Local 959 Alaska Full-Time and Part-Time Riders",
    shortName: "Local 959 Alaska",
    type: "rider",
    description: "Additional provisions for Local 959 (Alaska)",
  },
  "local-996-hawaii": {
    id: "local-996-hawaii",
    name: "Local 996 Hawaii Supplemental Agreement",
    shortName: "Local 996 Hawaii",
    type: "rider",
    description: "Additional provisions for Local 996 (Hawaii)",
  },
  "jc3-feeder-package-mechanics": {
    id: "jc3-feeder-package-mechanics",
    name: "Joint Council 3 Feeder, Package, Mechanics Rider",
    shortName: "JC3 Rider",
    type: "rider",
    description: "Joint Council 3 provisions for OR/WA area",
  },
  "jc28-sort-rider": {
    id: "jc28-sort-rider",
    name: "Joint Council 28 Rider and Sort Addendum",
    shortName: "JC28 Rider",
    type: "rider",
    description: "Joint Council 28 provisions for WA area",
  },
  "jc37-package-sort": {
    id: "jc37-package-sort",
    name: "Joint Council 37 Package and Sort Riders",
    shortName: "JC37 Rider",
    type: "rider",
    description: "Joint Council 37 provisions for CA area",
  },
  "southwest-automotive": {
    id: "southwest-automotive",
    name: "Southwest Automotive and Utility Addendum",
    shortName: "SW Automotive",
    type: "rider",
    description: "Southwest automotive and utility provisions",
  },

  // Specialty agreements
  "cartage-services": {
    id: "cartage-services",
    name: "Cartage Services Inc Supplemental Agreement",
    shortName: "Cartage Services",
    type: "rider",
    description: "Provisions for Cartage Services Inc employees",
  },
  "trailer-conditioners": {
    id: "trailer-conditioners",
    name: "Trailer Conditioners Inc Supplemental Agreement",
    shortName: "Trailer Conditioners",
    type: "rider",
    description: "Provisions for Trailer Conditioners Inc employees",
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

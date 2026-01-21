/**
 * Document manifest for the contract corpus.
 *
 * Defines all documents available for processing with their metadata.
 */

import type { RawDocument } from "./types";

// Re-export RawDocument for external use
export type { RawDocument } from "./types";

/**
 * All contract documents in the MVP corpus.
 */
export const DOCUMENT_MANIFEST: RawDocument[] = [
  // Master Agreement
  {
    id: "master",
    title: "UPS Teamsters National Master Agreement 2023-2028",
    shortTitle: "National Master Agreement",
    type: "master",
    filePath: "data/contracts/master.pdf",
  },

  // Regional Supplements
  {
    id: "western",
    title: "Western Region of Teamsters UPS Supplemental Agreement",
    shortTitle: "Western Region Supplement",
    type: "supplement",
    filePath: "data/contracts/western.pdf",
    region: "western",
  },
  {
    id: "central",
    title: "Central Region of Teamsters UPS Supplemental Agreement",
    shortTitle: "Central Region Supplement",
    type: "supplement",
    filePath: "data/contracts/central.pdf",
    region: "central",
  },
  {
    id: "southern",
    title: "Southern Region of Teamsters UPS Supplemental Agreement",
    shortTitle: "Southern Region Supplement",
    type: "supplement",
    filePath: "data/contracts/southern.pdf",
    region: "southern",
  },
  {
    id: "atlantic",
    title: "Atlantic Area UPS Supplemental Agreement",
    shortTitle: "Atlantic Area Supplement",
    type: "supplement",
    filePath: "data/contracts/atlantic.pdf",
    region: "atlantic",
  },
  {
    id: "new-england",
    title: "New England Supplemental Agreement",
    shortTitle: "New England Supplement",
    type: "supplement",
    filePath: "data/contracts/new-england.pdf",
    region: "eastern",
  },

  // Local Agreements
  {
    id: "local-804",
    title: "Local 804 UPS Supplemental Agreement",
    shortTitle: "Local 804 Agreement",
    type: "local",
    filePath: "data/contracts/local-804.pdf",
    localNumber: 804,
  },
  {
    id: "local-243",
    title: "Local 243 Metro Detroit Supplemental Agreement",
    shortTitle: "Local 243 Detroit",
    type: "local",
    filePath: "data/contracts/local-243-metro-detroit.pdf",
    localNumber: 243,
  },

  // Riders
  {
    id: "northern-california",
    title: "Northern California Supplemental Agreement and Sort Rider",
    shortTitle: "NorCal Supplement",
    type: "rider",
    filePath: "data/contracts/northern-california.pdf",
    region: "western",
  },
  {
    id: "southwest-package",
    title: "Southwest Package and Sort Riders",
    shortTitle: "Southwest Package Rider",
    type: "rider",
    filePath: "data/contracts/southwest-package-sort.pdf",
    region: "western",
  },
  {
    id: "ohio-valley",
    title: "Ohio Rider",
    shortTitle: "Ohio Rider",
    type: "rider",
    filePath: "data/contracts/ohio-rider.pdf",
    region: "central",
  },
  {
    id: "michigan-indiana",
    title: "Michigan Rider",
    shortTitle: "Michigan Rider",
    type: "rider",
    filePath: "data/contracts/michigan-rider.pdf",
    region: "central",
  },
  {
    id: "central-pa",
    title: "Central Pennsylvania Supplemental Agreement",
    shortTitle: "Central PA Supplement",
    type: "rider",
    filePath: "data/contracts/central-pa.pdf",
    region: "atlantic",
  },
  {
    id: "western-pa",
    title: "Western Pennsylvania Supplemental Agreement",
    shortTitle: "Western PA Supplement",
    type: "rider",
    filePath: "data/contracts/western-pa.pdf",
    region: "atlantic",
  },
  {
    id: "metro-philadelphia",
    title: "Metro Philadelphia Supplemental Agreement",
    shortTitle: "Metro Philadelphia",
    type: "rider",
    filePath: "data/contracts/metro-philadelphia.pdf",
    region: "atlantic",
  },
  {
    id: "upstate-ny",
    title: "Upstate and Western New York Supplemental Agreement",
    shortTitle: "Upstate NY Supplement",
    type: "rider",
    filePath: "data/contracts/upstate-west-ny.pdf",
    region: "eastern",
  },

  // Additional Local Agreements
  {
    id: "local-177-drivers",
    title: "Local 177 Drivers Rider",
    shortTitle: "Local 177 Drivers",
    type: "local",
    filePath: "data/contracts/local-177-drivers.pdf",
    localNumber: 177,
  },
  {
    id: "local-177-mechanics",
    title: "Local 177 Mechanics Rider",
    shortTitle: "Local 177 Mechanics",
    type: "local",
    filePath: "data/contracts/local-177-mechanics.pdf",
    localNumber: 177,
  },
  {
    id: "local-89-louisville-air",
    title: "Local 89 Louisville Air Rider",
    shortTitle: "Local 89 Air",
    type: "local",
    filePath: "data/contracts/local-89-louisville-air.pdf",
    localNumber: 89,
  },
  {
    id: "local-135",
    title: "Local 135 Rider",
    shortTitle: "Local 135",
    type: "local",
    filePath: "data/contracts/local-135.pdf",
    localNumber: 135,
  },
  {
    id: "local-623",
    title: "Local 623 Supplemental Agreement",
    shortTitle: "Local 623",
    type: "local",
    filePath: "data/contracts/local-623.pdf",
    localNumber: 623,
  },
  {
    id: "local-959-alaska",
    title: "Local 959 Alaska Full-Time and Part-Time Riders",
    shortTitle: "Local 959 Alaska",
    type: "local",
    filePath: "data/contracts/local-959-alaska.pdf",
    localNumber: 959,
  },
  {
    id: "local-996-hawaii",
    title: "Local 996 Hawaii Supplemental Agreement",
    shortTitle: "Local 996 Hawaii",
    type: "local",
    filePath: "data/contracts/local-996-hawaii.pdf",
    localNumber: 996,
  },
  {
    id: "local-769-latin-america",
    title: "Local 769 Latin America Inc Rider",
    shortTitle: "Local 769 Latin America",
    type: "local",
    filePath: "data/contracts/local-769-latin-america.pdf",
    localNumber: 769,
  },

  // Joint Council Riders
  {
    id: "jc3-feeder-package-mechanics",
    title:
      "Joint Council 3 Feeder, Package, Mechanics and Combination Employees Rider",
    shortTitle: "JC3 Rider",
    type: "rider",
    filePath: "data/contracts/jc3-feeder-package-mechanics.pdf",
    region: "western",
  },
  {
    id: "jc28-sort-rider",
    title: "Joint Council 28 Rider and Sort Addendum",
    shortTitle: "JC28 Rider",
    type: "rider",
    filePath: "data/contracts/jc28-sort-rider.pdf",
    region: "western",
  },
  {
    id: "jc37-package-sort",
    title: "Joint Council 37 Package and Sort Riders",
    shortTitle: "JC37 Rider",
    type: "rider",
    filePath: "data/contracts/jc37-package-sort.pdf",
    region: "western",
  },

  // Specialty Agreements
  {
    id: "southwest-automotive",
    title: "Southwest Automotive and Utility Addendum",
    shortTitle: "SW Automotive",
    type: "rider",
    filePath: "data/contracts/southwest-automotive.pdf",
    region: "western",
  },
  {
    id: "cartage-services",
    title: "Cartage Services Inc Supplemental Agreement",
    shortTitle: "Cartage Services",
    type: "supplement",
    filePath: "data/contracts/cartage-services.pdf",
  },
  {
    id: "trailer-conditioners",
    title: "Trailer Conditioners Inc (TCI) Supplemental Agreement",
    shortTitle: "Trailer Conditioners",
    type: "supplement",
    filePath: "data/contracts/trailer-conditioners.pdf",
  },
];

/**
 * Get document by ID.
 */
export function getDocumentById(id: string): RawDocument | undefined {
  return DOCUMENT_MANIFEST.find((doc) => doc.id === id);
}

/**
 * Get all documents of a specific type.
 */
export function getDocumentsByType(type: RawDocument["type"]): RawDocument[] {
  return DOCUMENT_MANIFEST.filter((doc) => doc.type === type);
}

/**
 * Get all documents for a region.
 */
export function getDocumentsByRegion(region: string): RawDocument[] {
  return DOCUMENT_MANIFEST.filter((doc) => doc.region === region);
}

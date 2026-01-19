import type { Classification, ClassificationInfo } from "./types";

/**
 * All job classifications available for UPS Teamster workers.
 * Order is intentional - most common classifications first.
 */
export const CLASSIFICATIONS: ClassificationInfo[] = [
  {
    id: "rpcd",
    label: "Package Car Driver (RPCD)",
    description: "Regular Package Car Driver - full-time delivery driver",
  },
  {
    id: "feeder",
    label: "Feeder Driver",
    description: "Tractor-trailer driver moving freight between hubs",
  },
  {
    id: "pt-hub",
    label: "Part-Time Hub/Sort",
    description: "Part-time package handler, loader, or sorter",
  },
  {
    id: "22.3",
    label: "22.3 Combination",
    description: "Full-time combination job (two part-time positions)",
  },
  {
    id: "22.4",
    label: "22.4 Driver",
    description: "Hybrid driver with inside work and delivery duties",
  },
  {
    id: "air",
    label: "Air Driver",
    description: "Driver handling air packages and time-critical deliveries",
  },
  {
    id: "automotive",
    label: "Automotive/Mechanic",
    description: "Vehicle maintenance and repair technician",
  },
  {
    id: "clerical",
    label: "Clerical",
    description: "Office and administrative positions",
  },
  {
    id: "other",
    label: "Other",
    description: "Other job classification not listed above",
  },
];

/**
 * Get classification info by ID.
 */
export function getClassificationInfo(
  id: Classification
): ClassificationInfo | undefined {
  return CLASSIFICATIONS.find((c) => c.id === id);
}

/**
 * Get the display label for a classification.
 */
export function getClassificationLabel(id: Classification): string {
  return getClassificationInfo(id)?.label ?? id;
}

/**
 * Check if a classification ID is valid.
 */
export function isValidClassification(id: string): id is Classification {
  return CLASSIFICATIONS.some((c) => c.id === id);
}

/**
 * Check if the "Other" classification requires additional text input.
 */
export function requiresOtherText(classification: Classification): boolean {
  return classification === "other";
}

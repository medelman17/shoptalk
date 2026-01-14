export const CLASSIFICATIONS = {
  rpcd: "Package Car Driver (RPCD)",
  feeder: "Feeder Driver",
  pt_hub: "Part-Time Hub/Sort",
  combo_22_3: "22.3 Combination",
  driver_22_4: "22.4 Driver",
  air_driver: "Air Driver",
  automotive: "Automotive/Mechanic",
  clerical: "Clerical",
  other: "Other",
} as const;

export type Classification = keyof typeof CLASSIFICATIONS;

export const CLASSIFICATION_LIST = Object.entries(CLASSIFICATIONS).map(
  ([value, label]) => ({
    value: value as Classification,
    label,
  })
);

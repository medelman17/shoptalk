export const REGIONS = {
  western: "Western Region",
  central: "Central Region",
  southern: "Southern Region",
  atlantic: "Atlantic Area",
  eastern: "Eastern Region",
} as const;

export type Region = keyof typeof REGIONS;

// State to region mapping
export const STATE_REGIONS: Record<string, Region> = {
  // Western Region
  CA: "western",
  OR: "western",
  WA: "western",
  NV: "western",
  AZ: "western",
  CO: "western",
  UT: "western",
  NM: "western",
  WY: "western",
  MT: "western",
  ID: "western",
  HI: "western",
  AK: "western",
  // Central Region
  IL: "central",
  IN: "central",
  OH: "central",
  MI: "central",
  WI: "central",
  MN: "central",
  IA: "central",
  MO: "central",
  KS: "central",
  NE: "central",
  ND: "central",
  SD: "central",
  // Southern Region
  TX: "southern",
  LA: "southern",
  AR: "southern",
  OK: "southern",
  MS: "southern",
  AL: "southern",
  TN: "southern",
  KY: "southern",
  // Atlantic Area
  PA: "atlantic",
  NJ: "atlantic",
  DE: "atlantic",
  MD: "atlantic",
  VA: "atlantic",
  WV: "atlantic",
  DC: "atlantic",
  // Eastern Region
  NY: "eastern",
  CT: "eastern",
  MA: "eastern",
  NH: "eastern",
  VT: "eastern",
  ME: "eastern",
  RI: "eastern",
  // Special cases handled separately (FL, GA, NC, SC)
  FL: "southern",
  GA: "southern",
  NC: "atlantic",
  SC: "atlantic",
};

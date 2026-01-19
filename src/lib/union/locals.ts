import type { Local, Region } from "./types";

/**
 * Complete dataset of UPS Teamster Local unions.
 * Organized by region for efficient filtering.
 *
 * Note: This is a representative dataset. Some Locals may have merged
 * or changed since this data was compiled. The mapping logic handles
 * unknown Locals gracefully.
 */
export const LOCALS: Local[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // WESTERN REGION
  // California, Oregon, Washington, Nevada, Arizona, Colorado, Utah,
  // New Mexico, Wyoming, Montana, Idaho, Hawaii, Alaska
  // ═══════════════════════════════════════════════════════════════════════════

  // California
  { number: 63, name: "Local 63", city: "Covina", state: "CA", region: "western" },
  { number: 70, name: "Local 70", city: "Oakland", state: "CA", region: "western" },
  { number: 87, name: "Local 87", city: "Bakersfield", state: "CA", region: "western" },
  { number: 150, name: "Local 150", city: "Sacramento", state: "CA", region: "western" },
  { number: 166, name: "Local 166", city: "Bloomington", state: "CA", region: "western" },
  { number: 186, name: "Local 186", city: "Ventura", state: "CA", region: "western" },
  { number: 287, name: "Local 287", city: "San Jose", state: "CA", region: "western" },
  { number: 315, name: "Local 315", city: "Martinez", state: "CA", region: "western" },
  { number: 350, name: "Local 350", city: "Daly City", state: "CA", region: "western" },
  { number: 386, name: "Local 386", city: "Modesto", state: "CA", region: "western" },
  { number: 396, name: "Local 396", city: "Los Angeles", state: "CA", region: "western" },
  { number: 399, name: "Local 399", city: "Hollywood", state: "CA", region: "western" },
  { number: 481, name: "Local 481", city: "San Diego", state: "CA", region: "western" },
  { number: 492, name: "Local 492", city: "Stockton", state: "CA", region: "western" },
  { number: 542, name: "Local 542", city: "San Diego", state: "CA", region: "western" },
  { number: 572, name: "Local 572", city: "Carson", state: "CA", region: "western" },
  { number: 601, name: "Local 601", city: "Stockton", state: "CA", region: "western" },
  { number: 630, name: "Local 630", city: "Los Angeles", state: "CA", region: "western" },
  { number: 848, name: "Local 848", city: "Long Beach", state: "CA", region: "western" },
  { number: 853, name: "Local 853", city: "San Leandro", state: "CA", region: "western" },
  { number: 856, name: "Local 856", city: "San Bruno", state: "CA", region: "western" },
  { number: 890, name: "Local 890", city: "Salinas", state: "CA", region: "western" },
  { number: 912, name: "Local 912", city: "Watsonville", state: "CA", region: "western" },
  { number: 986, name: "Local 986", city: "South El Monte", state: "CA", region: "western" },

  // Oregon
  { number: 58, name: "Local 58", city: "Portland", state: "OR", region: "western" },
  { number: 162, name: "Local 162", city: "Portland", state: "OR", region: "western" },
  { number: 206, name: "Local 206", city: "Portland", state: "OR", region: "western" },
  { number: 223, name: "Local 223", city: "Eugene", state: "OR", region: "western" },
  { number: 324, name: "Local 324", city: "Butte", state: "MT", region: "western" },

  // Washington
  { number: 38, name: "Local 38", city: "Seattle", state: "WA", region: "western" },
  { number: 117, name: "Local 117", city: "Tukwila", state: "WA", region: "western" },
  { number: 174, name: "Local 174", city: "Seattle", state: "WA", region: "western" },
  { number: 231, name: "Local 231", city: "Spokane", state: "WA", region: "western" },
  { number: 252, name: "Local 252", city: "Bellingham", state: "WA", region: "western" },
  { number: 313, name: "Local 313", city: "Seattle", state: "WA", region: "western" },
  { number: 589, name: "Local 589", city: "Seattle", state: "WA", region: "western" },
  { number: 763, name: "Local 763", city: "Seattle", state: "WA", region: "western" },

  // Nevada
  { number: 14, name: "Local 14", city: "Las Vegas", state: "NV", region: "western" },
  { number: 533, name: "Local 533", city: "Reno", state: "NV", region: "western" },
  { number: 631, name: "Local 631", city: "Las Vegas", state: "NV", region: "western" },

  // Arizona
  { number: 104, name: "Local 104", city: "Phoenix", state: "AZ", region: "western" },
  { number: 274, name: "Local 274", city: "Tucson", state: "AZ", region: "western" },

  // Colorado
  { number: 17, name: "Local 17", city: "Denver", state: "CO", region: "western" },
  { number: 435, name: "Local 435", city: "Denver", state: "CO", region: "western" },
  { number: 455, name: "Local 455", city: "Denver", state: "CO", region: "western" },

  // Utah
  { number: 222, name: "Local 222", city: "Salt Lake City", state: "UT", region: "western" },
  { number: 976, name: "Local 976", city: "Salt Lake City", state: "UT", region: "western" },

  // New Mexico
  { number: 492, name: "Local 492", city: "Albuquerque", state: "NM", region: "western" },

  // Idaho
  { number: 483, name: "Local 483", city: "Boise", state: "ID", region: "western" },

  // Montana
  { number: 2, name: "Local 2", city: "Billings", state: "MT", region: "western" },

  // Hawaii
  { number: 996, name: "Local 996", city: "Honolulu", state: "HI", region: "western" },

  // Alaska
  { number: 959, name: "Local 959", city: "Anchorage", state: "AK", region: "western" },

  // ═══════════════════════════════════════════════════════════════════════════
  // CENTRAL REGION
  // Illinois, Indiana, Ohio, Michigan, Wisconsin, Minnesota, Iowa,
  // Missouri, Kansas, Nebraska, North Dakota, South Dakota
  // ═══════════════════════════════════════════════════════════════════════════

  // Illinois (excluding 705, 710 which are standalone)
  { number: 50, name: "Local 50", city: "Belleville", state: "IL", region: "central" },
  { number: 179, name: "Local 179", city: "Springfield", state: "IL", region: "central" },
  { number: 330, name: "Local 330", city: "Peoria", state: "IL", region: "central" },
  { number: 371, name: "Local 371", city: "Peoria", state: "IL", region: "central" },
  { number: 673, name: "Local 673", city: "Chicago Heights", state: "IL", region: "central" },
  { number: 703, name: "Local 703", city: "Chicago", state: "IL", region: "central" },
  { number: 705, name: "Local 705", city: "Chicago", state: "IL", region: "central" }, // Standalone
  { number: 710, name: "Local 710", city: "Chicago", state: "IL", region: "central" }, // Standalone
  { number: 734, name: "Local 734", city: "Chicago", state: "IL", region: "central" },

  // Indiana
  { number: 135, name: "Local 135", city: "Indianapolis", state: "IN", region: "central" },
  { number: 142, name: "Local 142", city: "Gary", state: "IN", region: "central" },
  { number: 215, name: "Local 215", city: "Evansville", state: "IN", region: "central" },
  { number: 364, name: "Local 364", city: "South Bend", state: "IN", region: "central" },
  { number: 414, name: "Local 414", city: "Fort Wayne", state: "IN", region: "central" },

  // Ohio
  { number: 20, name: "Local 20", city: "Toledo", state: "OH", region: "central" },
  { number: 40, name: "Local 40", city: "Cincinnati", state: "OH", region: "central" },
  { number: 92, name: "Local 92", city: "Cincinnati", state: "OH", region: "central" },
  { number: 100, name: "Local 100", city: "Cincinnati", state: "OH", region: "central" },
  { number: 114, name: "Local 114", city: "Cleveland", state: "OH", region: "central" },
  { number: 244, name: "Local 244", city: "Akron", state: "OH", region: "central" },
  { number: 284, name: "Local 284", city: "Youngstown", state: "OH", region: "central" },
  { number: 377, name: "Local 377", city: "Youngstown", state: "OH", region: "central" },
  { number: 407, name: "Local 407", city: "Cleveland", state: "OH", region: "central" },
  { number: 413, name: "Local 413", city: "Columbus", state: "OH", region: "central" },
  { number: 416, name: "Local 416", city: "Cleveland", state: "OH", region: "central" },
  { number: 436, name: "Local 436", city: "Cleveland", state: "OH", region: "central" },
  { number: 480, name: "Local 480", city: "Columbus", state: "OH", region: "central" },
  { number: 507, name: "Local 507", city: "Cleveland", state: "OH", region: "central" },
  { number: 637, name: "Local 637", city: "Dayton", state: "OH", region: "central" },
  { number: 957, name: "Local 957", city: "Dayton", state: "OH", region: "central" },

  // Michigan
  { number: 243, name: "Local 243", city: "Detroit", state: "MI", region: "central" },
  { number: 247, name: "Local 247", city: "Detroit", state: "MI", region: "central" },
  { number: 283, name: "Local 283", city: "Ann Arbor", state: "MI", region: "central" },
  { number: 299, name: "Local 299", city: "Detroit", state: "MI", region: "central" },
  { number: 332, name: "Local 332", city: "Flint", state: "MI", region: "central" },
  { number: 337, name: "Local 337", city: "Detroit", state: "MI", region: "central" },
  { number: 339, name: "Local 339", city: "Mason", state: "MI", region: "central" },
  { number: 406, name: "Local 406", city: "Grand Rapids", state: "MI", region: "central" },

  // Wisconsin
  { number: 200, name: "Local 200", city: "Milwaukee", state: "WI", region: "central" },
  { number: 344, name: "Local 344", city: "Milwaukee", state: "WI", region: "central" },
  { number: 662, name: "Local 662", city: "Green Bay", state: "WI", region: "central" },
  { number: 695, name: "Local 695", city: "Madison", state: "WI", region: "central" },

  // Minnesota
  { number: 120, name: "Local 120", city: "Blaine", state: "MN", region: "central" },
  { number: 289, name: "Local 289", city: "St. Cloud", state: "MN", region: "central" },
  { number: 544, name: "Local 544", city: "Minneapolis", state: "MN", region: "central" },
  { number: 638, name: "Local 638", city: "Minneapolis", state: "MN", region: "central" },

  // Iowa
  { number: 90, name: "Local 90", city: "Des Moines", state: "IA", region: "central" },
  { number: 147, name: "Local 147", city: "Cedar Rapids", state: "IA", region: "central" },
  { number: 238, name: "Local 238", city: "Cedar Rapids", state: "IA", region: "central" },
  { number: 431, name: "Local 431", city: "Dubuque", state: "IA", region: "central" },

  // Missouri
  { number: 41, name: "Local 41", city: "Kansas City", state: "MO", region: "central" },
  { number: 245, name: "Local 245", city: "Springfield", state: "MO", region: "central" },
  { number: 600, name: "Local 600", city: "St. Louis", state: "MO", region: "central" },
  { number: 618, name: "Local 618", city: "St. Louis", state: "MO", region: "central" },
  { number: 682, name: "Local 682", city: "St. Louis", state: "MO", region: "central" },
  { number: 688, name: "Local 688", city: "St. Louis", state: "MO", region: "central" },

  // Kansas
  { number: 541, name: "Local 541", city: "Wichita", state: "KS", region: "central" },
  { number: 696, name: "Local 696", city: "Topeka", state: "KS", region: "central" },

  // Nebraska
  { number: 554, name: "Local 554", city: "Omaha", state: "NE", region: "central" },

  // North Dakota
  { number: 74, name: "Local 74", city: "Fargo", state: "ND", region: "central" },

  // South Dakota
  { number: 749, name: "Local 749", city: "Sioux Falls", state: "SD", region: "central" },

  // ═══════════════════════════════════════════════════════════════════════════
  // EASTERN REGION
  // New York (outside 804), Connecticut, Massachusetts, New Hampshire,
  // Vermont, Maine, Rhode Island
  // ═══════════════════════════════════════════════════════════════════════════

  // New York (outside 804)
  { number: 118, name: "Local 118", city: "Rochester", state: "NY", region: "eastern" },
  { number: 182, name: "Local 182", city: "Utica", state: "NY", region: "eastern" },
  { number: 264, name: "Local 264", city: "Buffalo", state: "NY", region: "eastern" },
  { number: 294, name: "Local 294", city: "Albany", state: "NY", region: "eastern" },
  { number: 317, name: "Local 317", city: "Syracuse", state: "NY", region: "eastern" },
  { number: 449, name: "Local 449", city: "Buffalo", state: "NY", region: "eastern" },
  { number: 529, name: "Local 529", city: "Binghamton", state: "NY", region: "eastern" },
  { number: 687, name: "Local 687", city: "Jamestown", state: "NY", region: "eastern" },
  { number: 693, name: "Local 693", city: "Flushing", state: "NY", region: "eastern" },
  { number: 804, name: "Local 804", city: "Long Island City", state: "NY", region: "eastern" }, // Standalone
  { number: 814, name: "Local 814", city: "New York", state: "NY", region: "eastern" },

  // Connecticut
  { number: 191, name: "Local 191", city: "Hartford", state: "CT", region: "eastern" },
  { number: 443, name: "Local 443", city: "New Haven", state: "CT", region: "eastern" },
  { number: 493, name: "Local 493", city: "Bridgeport", state: "CT", region: "eastern" },
  { number: 671, name: "Local 671", city: "Hartford", state: "CT", region: "eastern" },

  // Massachusetts
  { number: 25, name: "Local 25", city: "Charlestown", state: "MA", region: "eastern" },
  { number: 170, name: "Local 170", city: "Worcester", state: "MA", region: "eastern" },
  { number: 379, name: "Local 379", city: "Springfield", state: "MA", region: "eastern" },
  { number: 404, name: "Local 404", city: "Weymouth", state: "MA", region: "eastern" },
  { number: 653, name: "Local 653", city: "Boston", state: "MA", region: "eastern" },

  // New Hampshire
  { number: 633, name: "Local 633", city: "Manchester", state: "NH", region: "eastern" },

  // Vermont
  { number: 597, name: "Local 597", city: "Burlington", state: "VT", region: "eastern" },

  // Maine
  { number: 340, name: "Local 340", city: "Portland", state: "ME", region: "eastern" },

  // Rhode Island
  { number: 251, name: "Local 251", city: "Providence", state: "RI", region: "eastern" },

  // ═══════════════════════════════════════════════════════════════════════════
  // ATLANTIC AREA
  // Pennsylvania, New Jersey, Delaware, Maryland, Virginia, West Virginia, DC
  // ═══════════════════════════════════════════════════════════════════════════

  // Pennsylvania
  { number: 107, name: "Local 107", city: "Philadelphia", state: "PA", region: "atlantic" },
  { number: 169, name: "Local 169", city: "Pittsburgh", state: "PA", region: "atlantic" },
  { number: 229, name: "Local 229", city: "Scranton", state: "PA", region: "atlantic" },
  { number: 249, name: "Local 249", city: "Pittsburgh", state: "PA", region: "atlantic" },
  { number: 312, name: "Local 312", city: "Allentown", state: "PA", region: "atlantic" },
  { number: 384, name: "Local 384", city: "York", state: "PA", region: "atlantic" },
  { number: 401, name: "Local 401", city: "Wilkes-Barre", state: "PA", region: "atlantic" },
  { number: 429, name: "Local 429", city: "Reading", state: "PA", region: "atlantic" },
  { number: 430, name: "Local 430", city: "Butler", state: "PA", region: "atlantic" },
  { number: 764, name: "Local 764", city: "Harrisburg", state: "PA", region: "atlantic" },
  { number: 771, name: "Local 771", city: "Erie", state: "PA", region: "atlantic" },
  { number: 773, name: "Local 773", city: "Lancaster", state: "PA", region: "atlantic" },

  // New Jersey
  { number: 11, name: "Local 11", city: "Elizabeth", state: "NJ", region: "atlantic" },
  { number: 97, name: "Local 97", city: "Jersey City", state: "NJ", region: "atlantic" },
  { number: 102, name: "Local 102", city: "Union", state: "NJ", region: "atlantic" },
  { number: 115, name: "Local 115", city: "Philadelphia", state: "PA", region: "atlantic" },
  { number: 125, name: "Local 125", city: "Paterson", state: "NJ", region: "atlantic" },
  { number: 177, name: "Local 177", city: "Hillside", state: "NJ", region: "atlantic" },
  { number: 408, name: "Local 408", city: "Camden", state: "NJ", region: "atlantic" },
  { number: 469, name: "Local 469", city: "Hazlet", state: "NJ", region: "atlantic" },
  { number: 560, name: "Local 560", city: "Union City", state: "NJ", region: "atlantic" },
  { number: 641, name: "Local 641", city: "Union City", state: "NJ", region: "atlantic" },
  { number: 676, name: "Local 676", city: "Bordentown", state: "NJ", region: "atlantic" },

  // Delaware
  { number: 326, name: "Local 326", city: "Wilmington", state: "DE", region: "atlantic" },

  // Maryland
  { number: 311, name: "Local 311", city: "Baltimore", state: "MD", region: "atlantic" },
  { number: 355, name: "Local 355", city: "Baltimore", state: "MD", region: "atlantic" },
  { number: 557, name: "Local 557", city: "Baltimore", state: "MD", region: "atlantic" },
  { number: 570, name: "Local 570", city: "Baltimore", state: "MD", region: "atlantic" },
  { number: 592, name: "Local 592", city: "Cumberland", state: "MD", region: "atlantic" },

  // Virginia
  { number: 29, name: "Local 29", city: "Roanoke", state: "VA", region: "atlantic" },
  { number: 171, name: "Local 171", city: "Roanoke", state: "VA", region: "atlantic" },
  { number: 322, name: "Local 322", city: "Roanoke", state: "VA", region: "atlantic" },
  { number: 391, name: "Local 391", city: "Norfolk", state: "VA", region: "atlantic" },
  { number: 592, name: "Local 592", city: "Richmond", state: "VA", region: "atlantic" },
  { number: 822, name: "Local 822", city: "Norfolk", state: "VA", region: "atlantic" },

  // West Virginia
  { number: 175, name: "Local 175", city: "Charleston", state: "WV", region: "atlantic" },
  { number: 505, name: "Local 505", city: "Huntington", state: "WV", region: "atlantic" },

  // Washington D.C.
  { number: 639, name: "Local 639", city: "Washington", state: "DC", region: "atlantic" },
  { number: 730, name: "Local 730", city: "Washington", state: "DC", region: "atlantic" },

  // ═══════════════════════════════════════════════════════════════════════════
  // SOUTHERN REGION
  // Texas, Louisiana, Arkansas, Oklahoma, Mississippi, Alabama, Tennessee,
  // Kentucky, Georgia, Florida, North Carolina, South Carolina
  // ═══════════════════════════════════════════════════════════════════════════

  // Texas
  { number: 19, name: "Local 19", city: "Houston", state: "TX", region: "southern" },
  { number: 47, name: "Local 47", city: "El Paso", state: "TX", region: "southern" },
  { number: 577, name: "Local 577", city: "Amarillo", state: "TX", region: "southern" },
  { number: 657, name: "Local 657", city: "San Antonio", state: "TX", region: "southern" },
  { number: 745, name: "Local 745", city: "Dallas", state: "TX", region: "southern" },
  { number: 767, name: "Local 767", city: "Fort Worth", state: "TX", region: "southern" },
  { number: 988, name: "Local 988", city: "Houston", state: "TX", region: "southern" },

  // Louisiana
  { number: 5, name: "Local 5", city: "Baton Rouge", state: "LA", region: "southern" },
  { number: 270, name: "Local 270", city: "New Orleans", state: "LA", region: "southern" },

  // Arkansas
  { number: 373, name: "Local 373", city: "Little Rock", state: "AR", region: "southern" },
  { number: 878, name: "Local 878", city: "Little Rock", state: "AR", region: "southern" },

  // Oklahoma
  { number: 523, name: "Local 523", city: "Oklahoma City", state: "OK", region: "southern" },
  { number: 886, name: "Local 886", city: "Tulsa", state: "OK", region: "southern" },

  // Mississippi
  { number: 891, name: "Local 891", city: "Jackson", state: "MS", region: "southern" },

  // Alabama
  { number: 402, name: "Local 402", city: "Birmingham", state: "AL", region: "southern" },
  { number: 612, name: "Local 612", city: "Birmingham", state: "AL", region: "southern" },
  { number: 991, name: "Local 991", city: "Mobile", state: "AL", region: "southern" },

  // Tennessee
  { number: 327, name: "Local 327", city: "Nashville", state: "TN", region: "southern" },
  { number: 480, name: "Local 480", city: "Chattanooga", state: "TN", region: "southern" },
  { number: 519, name: "Local 519", city: "Knoxville", state: "TN", region: "southern" },
  { number: 667, name: "Local 667", city: "Memphis", state: "TN", region: "southern" },

  // Kentucky
  { number: 89, name: "Local 89", city: "Louisville", state: "KY", region: "southern" },
  { number: 651, name: "Local 651", city: "Lexington", state: "KY", region: "southern" },
  { number: 783, name: "Local 783", city: "Covington", state: "KY", region: "southern" },

  // Georgia
  { number: 28, name: "Local 28", city: "Atlanta", state: "GA", region: "southern" },
  { number: 528, name: "Local 528", city: "Atlanta", state: "GA", region: "southern" },
  { number: 728, name: "Local 728", city: "Atlanta", state: "GA", region: "southern" },
  { number: 728, name: "Local 728", city: "Savannah", state: "GA", region: "southern" },

  // Florida
  { number: 79, name: "Local 79", city: "Tampa", state: "FL", region: "southern" },
  { number: 385, name: "Local 385", city: "Orlando", state: "FL", region: "southern" },
  { number: 390, name: "Local 390", city: "Miami", state: "FL", region: "southern" },
  { number: 512, name: "Local 512", city: "Jacksonville", state: "FL", region: "southern" },
  { number: 769, name: "Local 769", city: "Miami", state: "FL", region: "southern" },

  // North Carolina
  { number: 61, name: "Local 61", city: "Charlotte", state: "NC", region: "southern" },
  { number: 391, name: "Local 391", city: "Greensboro", state: "NC", region: "southern" },
  { number: 505, name: "Local 505", city: "Charlotte", state: "NC", region: "southern" },
  { number: 71, name: "Local 71", city: "Charlotte", state: "NC", region: "southern" },

  // South Carolina
  { number: 509, name: "Local 509", city: "Charleston", state: "SC", region: "southern" },
  { number: 810, name: "Local 810", city: "Columbia", state: "SC", region: "southern" },
];

/**
 * Get all Locals in a specific region.
 */
export function getLocalsByRegion(region: Region): Local[] {
  return LOCALS.filter((local) => local.region === region);
}

/**
 * Get a Local by its number.
 */
export function getLocalByNumber(number: number): Local | undefined {
  return LOCALS.find((local) => local.number === number);
}

/**
 * Get all unique states in the dataset.
 */
export function getAllStates(): string[] {
  return [...new Set(LOCALS.map((l) => l.state))].sort();
}

/**
 * Format a Local for display.
 */
export function formatLocalDisplay(local: Local): string {
  return `Local ${local.number} - ${local.city}, ${local.state}`;
}

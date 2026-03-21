export const countryColors = {
  // Americas
  "us": "#3C3B6E", // USA blue
  "ca": "#CE1126", // Canada red
  "mx": "#009B3A", // Mexico green
  "br": "#009C3B", // Brazil green
  "ar": "#40AE4F", // Argentina light green
  "cl": "#DAF14B", // Chile yellow

  // Europe
  "gb": "#00247D", // UK blue
  "fr": "#002395", // France blue
  "de": "#000000", // Germany black
  "it": "#009246", // Italy green
  "es": "#AA151B", // Spain red
  "nl": "#21468B", // Netherlands blue
  "se": "#136A8A", // Sweden blue
  "no": "#EF2B2D", // Norway red

  // Asia
  "in": "#FF9933", // India saffron
  "cn": "#DE2910", // China red
  "jp": "#FFFFFF", // Japan white (with red circle)
  "kr": "#CD2E3A", // South Korea red
  "tr": "#E30A17", // Turkey red
  "sa": "#0066B8", // Saudi Arabia green-blue

  // Africa/Middle East
  "eg": "#FF0000", // Egypt red
  "za": "#007A4D", // South Africa green
  "ae": "#00732F", // UAE green

  // Oceania
  "au": "#000080", // Australia blue

  // Default
  "un": "#808080", // Grey for unknown
  "default": "#BD8D31" // Brownish earth tone fallback
};

export const getCountryColor = (countryCode) => {
  return countryColors[countryCode?.toLowerCase()] || countryColors.default;
};

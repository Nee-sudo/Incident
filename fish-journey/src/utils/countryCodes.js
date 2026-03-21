export const countryCodes = {
  "united states": "us",
  "usa": "us",
  "india": "in",
  "united kingdom": "gb",
  "uk": "gb",
  "france": "fr",
  "germany": "de",
  "japan": "jp",
  "china": "cn",
  "brazil": "br",
  "australia": "au",
  "canada": "ca",
  "mexico": "mx",
  "italy": "it",
  "spain": "es",
  "russia": "ru",
  "south korea": "kr",
  "netherlands": "nl",
  "sweden": "se",
  "norway": "no",
  "denmark": "dk",
  "finland": "fi",
  "poland": "pl",
  "turkey": "tr",
  "saudi arabia": "sa",
  "uae": "ae",
  "egypt": "eg",
  "south africa": "za",
  "argentina": "ar",
  "chile": "cl",
  "peru": "pe",
  // Add more as needed
};

export const normalizeCountryName = (name) => {
  if (!name) return 'un';
  const lower = name.toLowerCase().trim();
  return countryCodes[lower] || lower.slice(0,2);
};

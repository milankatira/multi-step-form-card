export const COUNTRIES_API = 'https://restcountries.com/v3.1/all';
export const CITIES_API = (countryCode: string) =>
  `https://wft-geo-db.p.rapidapi.com/v1/geo/cities?countryIds=${countryCode}&limit=10`;

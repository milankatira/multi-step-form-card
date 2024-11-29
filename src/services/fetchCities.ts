import { CITIES_API } from '@/api';
import axios from 'axios';

const RAPIDAPI_KEY = import.meta.env.VITE_RAPIDAPI_KEY;

export const fetchCities = async (countryCode: string) => {
  const response = await axios.get(CITIES_API(countryCode), {
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com',
    },
  });
  return response.data.data.map((city: { name: string }) => city.name);
};

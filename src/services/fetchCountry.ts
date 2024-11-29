import { COUNTRIES_API } from '@/api';
import axios from 'axios';

export const fetchCountries = async () => {
  const response = await axios.get(COUNTRIES_API);
  return response.data.map(
    (country: { name: { common: string }; cca2: string }) => ({
      name: country.name.common,
      code: country.cca2,
    }),
  );
};

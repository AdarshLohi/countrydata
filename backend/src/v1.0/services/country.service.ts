import axios from 'axios';
import logger from '../../utils/logger';

export const fetchCountryData = async (): Promise<any> => {
  try {
    const response = await axios.get(`${process.env.COUNTRY_API}v3.1/all?fields=name`);
    return response.data;
  } catch (error: any) {
    logger.error(`Failed to fetch data from REST Countries API: ${error.message}`);
    throw new Error('Unable to fetch country data');
  }
};

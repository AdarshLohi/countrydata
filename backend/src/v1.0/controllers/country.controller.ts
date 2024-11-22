import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import Redis from 'ioredis';
import { generateToken } from '../../utils/jwt';
import logger from '../../utils/logger';
import { fetchCountryData } from '../services/country.service';
const redisClient = new Redis();
const REDIS_KEY = 'countries_data';
const CACHE_EXPIRATION = 3600;

export const country = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    // Check if data exists in Redis cache
    const cachedData: any = await redisClient.get(REDIS_KEY);
    if (cachedData) {
      logger.info('Data retrieved from Redis cache');
      return res.status(200).json({
        status: 200,
        message: 'Country data',
        data: JSON.parse(cachedData),
      });
    }

    // Fetch data from the API
    logger.info('Fetching data from REST Countries API...');
    const countryDetails = await fetchCountryData();

    if (!countryDetails || countryDetails.length === 0) {
      logger.error('No data retrieved from the REST Countries API');
      return res.status(500).json({
        status: 500,
        message: 'No country data available',
      });
    }

    // Cache the data in Redis
    await redisClient.setex(REDIS_KEY, CACHE_EXPIRATION, JSON.stringify(countryDetails));
    logger.info('Data cached in Redis');

    // Send the response
    return res.status(200).json({
      status: 200,
      message: 'Country data retrieved from API',
      data: countryDetails,
    });
  } catch (error: any) {
    logger.error(`Error processing country data: ${error.message}`);
    next(error); // Pass error to the Express error handler
  }
};

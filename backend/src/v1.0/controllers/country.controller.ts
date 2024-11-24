import { Request, Response, NextFunction, RequestHandler } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../../utils/jwt';
import logger from '../../utils/logger';
import { fetchCountryData } from '../services/country.service';
import { ApiResponse, CountryData } from '../Types/ApiResponceTypes';
import { PaginatedResponse } from '../Types/PaginationType';

interface PaginationQuery {
  page?: string;
  limit?: string;
}

export const countries = async (
  req: Request<{}, {}, {}, PaginationQuery>,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page || '1', 10);
    const limit = parseInt(req.query.limit || '10', 10);

    // Validate pagination parameters
    if (page < 1 || limit < 1) {
      return res.status(400).json({
        status: 400,
        message: 'Invalid pagination parameters. Page and limit must be positive numbers.',
      });
    }

    // Calculate skip value for pagination
    const skip = (page - 1) * limit;

    logger.info('Fetching data from the service...');
    const countryDetails = await fetchCountryData();

    if (!countryDetails || countryDetails.length === 0) {
      logger.error('No data retrieved from the fetchCountryData service');
      return res.status(500).json({
        status: 500,
        message: 'No country data available',
      });
    }

    // Apply filtering
    const filteredData = filterDetails(countryDetails);

    // Calculate pagination values
    const totalItems = filteredData.length;
    const totalPages = Math.ceil(totalItems / limit);

    // Slice the data array for pagination
    const paginatedData = filteredData.slice(skip, skip + limit);

    // Generate pagination URLs
    const baseUrl = `${req.protocol}://${req.get('host')}/api/1.0/countries`;

    // Prepare pagination metadata with URLs
    const paginationData = {
      currentPage: page,
      totalPages: totalPages,
      totalItems: totalItems,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      links: {
        current: `${baseUrl}?page=${page}&limit=${limit}`,
        next: page < totalPages ? `${baseUrl}?page=${page + 1}&limit=${limit}` : null,
        prev: page > 1 ? `${baseUrl}?page=${page - 1}&limit=${limit}` : null,
        first: `${baseUrl}?page=1&limit=${limit}`,
        last: `${baseUrl}?page=${totalPages}&limit=${limit}`,
      },
    };

    // Send the paginated response
    const response: PaginatedResponse = {
      status: 200,
      message: 'Country data retrieved successfully',
      data: paginatedData,
      pagination: paginationData,
    };

    return res.status(200).json(response);
  } catch (error: any) {
    logger.error(`Error fetching country data: ${error.message}`);
    next(error); // Pass error to the Express error handler
  }
};

export const countriesByCode = async (
  req: Request<{ code: string }, ApiResponse, never, never>,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<void> => {
  try {
    const { code } = req.params;

    if (!code) {
      logger.warn('Country code is missing in the request');
      res.status(400).json({
        status: 400,
        message: 'Country code is required',
      });
      return;
    }

    logger.info('Fetching country data from the service...');
    const countryDetails = await fetchCountryData();

    if (!countryDetails || countryDetails.length === 0) {
      logger.error('No data retrieved from the fetchCountryData service');
      res.status(500).json({
        status: 500,
        message: 'No country data available',
      });
      return;
    }

    const country = countryDetails.find(
      (c: any) =>
        c.cca2?.toLowerCase() === code.toLowerCase() || c.cca3?.toLowerCase() === code.toLowerCase()
    );

    if (!country) {
      logger.warn(`No country found with code: ${code}`);
      res.status(404).json({
        status: 404,
        message: `No country found with code: ${code}`,
      });
      return;
    }

    const result = filterDetails(country);

    res.status(200).json({
      status: 200,
      message: 'Country data retrieved successfully',
      data: result,
    });
  } catch (error) {
    logger.error(
      `Error fetching country by code: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
    next(error);
  }
};

export const countriesByRegion = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<any> => {
  try {
    // Extract the region parameter from the request query
    const { region } = req.params;

    if (!region) {
      logger.warn('Region is missing in the request');
      return res.status(400).json({
        status: 400,
        message: 'Region is required',
      });
    }

    // Fetch all country data using the service
    logger.info('Fetching country data from the service...');
    const countryDetails = await fetchCountryData();

    if (!countryDetails || countryDetails.length === 0) {
      logger.error('No data retrieved from the fetchCountryData service');
      return res.status(500).json({
        status: 500,
        message: 'No country data available',
      });
    }

    // Filter countries by region
    const countriesInRegion = countryDetails.filter(
      (country: any) => country.region?.toLowerCase() === region.toLowerCase()
    );

    if (countriesInRegion.length === 0) {
      logger.warn(`No countries found in region: ${region}`);
      return res.status(404).json({
        status: 404,
        message: `No countries found in region: ${region}`,
      });
    }

    const result = filterDetails(countriesInRegion);

    // Send the response
    return res.status(200).json({
      status: 200,
      message: `Countries in the ${region} region retrieved successfully`,
      data: result,
    });
  } catch (error: any) {
    logger.error(`Error fetching countries by region: ${error.message}`);
    next(error); // Pass error to the Express error handler
  }
};

export const searchCountries = async (
  req: Request,
  res: Response<ApiResponse>,
  next: NextFunction
): Promise<any> => {
  console.log('Query Params:', req.query);
  try {
    // Extract query parameters
    const { name, region, capital, timezone } = req.query;

    if (!name && !region && !capital && !timezone) {
      logger.warn('No valid query parameters are provided in the request');
      return res.status(400).json({
        status: 400,
        message:
          'At least one of "name", "region", "capital", or "timezone" query parameters is required',
      });
    }

    // Fetch all country data using the service
    logger.info('Fetching country data from the service...');
    const countryDetails = await fetchCountryData();

    if (!countryDetails || countryDetails.length === 0) {
      logger.error('No data retrieved from the fetchCountryData service');
      return res.status(500).json({
        status: 500,
        message: 'No country data available',
      });
    }

    // Filter countries by query parameters if provided
    const filteredCountries = countryDetails.filter((country: any) => {
      const matchesName =
        name && country.name.common.toLowerCase().includes((name as string).toLowerCase());
      const matchesRegion =
        region && country.region?.toLowerCase() === (region as string).toLowerCase();
      const matchesCapital =
        capital &&
        country.capital?.some(
          (cap: string) => cap.toLowerCase() === (capital as string).toLowerCase()
        );
      const matchesTimeZone =
        timezone &&
        country.timezones?.some(
          (tz: string) => tz.toLowerCase().trim() === (timezone as any).toLowerCase().trim()
        );

      if (name && region && capital && timezone) {
        return matchesName && matchesRegion && matchesCapital && matchesTimeZone;
      }
      if (name && region && capital) {
        return matchesName && matchesRegion && matchesCapital;
      }
      if (name && region) {
        return matchesName && matchesRegion;
      }
      if (name) {
        return matchesName;
      }
      if (region) {
        return matchesRegion;
      }
      if (capital) {
        return matchesCapital;
      }
      if (timezone) {
        return matchesTimeZone;
      }

      return false;
    });

    if (filteredCountries.length === 0) {
      logger.warn(
        `No countries found for query: name="${name}", region="${region}", capital="${capital}", timezone="${timezone}"`
      );
      return res.status(404).json({
        status: 404,
        message: 'No countries found matching the search criteria',
      });
    }

    const result = filterDetails(filteredCountries);

    // Send the response
    return res.status(200).json({
      status: 200,
      message: 'Country search results',
      data: result,
    });
  } catch (error: any) {
    logger.error(`Error searching for countries: ${error.message}`);
    next(error); // Pass error to the Express error handler
  }
};

const filterDetails = (filteredData: any): CountryData[] => {
  const dataArray = Array.isArray(filteredData) ? filteredData : [filteredData];
  return dataArray.map((country: any) => ({
    name: country.name.common,
    population: country.population,
    flag: country.flags?.svg || country.flags?.png || null,
    region: country.region,
    currencies: Object.values(country.currencies || {}).map((currency: any) => ({
      name: currency.name,
      symbol: currency.symbol,
    })),
    timezones: country.timezones,
  }));
};

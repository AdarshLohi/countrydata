import axiosInstance from '@/utils/services';

export interface Country {
  id: number;
  name: string;
  flag: string;
  region: string;
  timezone: string;
}

export interface PaginatedCountriesResponse {
  countries: Country[];
  currentPage: number;
  totalPages: number;
}

export const fetchCountries = async (
  page: number = 1,
  limit: number = 10
): Promise<PaginatedCountriesResponse> => {
  try {
    const response = await axiosInstance.get<PaginatedCountriesResponse>(
      `1.0/countries?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch countries');
  }
};

export const fetchCountriesByRegion = async (
  region: string,
  page: number = 1,
  limit: number = 10
): Promise<PaginatedCountriesResponse> => {
  try {
    const response = await axiosInstance.get<PaginatedCountriesResponse>(
      `1.0/countries/region/${region}?page=${page}&limit=${limit}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch countries');
  }
};

export const fetchCountriesDetails = async (code: string, name: string): Promise<Country[]> => {
  try {
    const response = await axiosInstance.get<Country[]>(`1.0/countries/${code}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch countries');
  }
};

export const searchCountry = async (
  region?: string,
  capital?: string,
  name?: string,
  page: number = 1,
  limit: number = 10
): Promise<Country[]> => {
  try {
    const response = await axiosInstance.get<Country[]>(
      `1.0/countries/search?page=${page}&limit=${limit}`,
      {
        params: {
          region: region || undefined,
          capital: capital || undefined,
          name: name || undefined,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch countries');
  }
};

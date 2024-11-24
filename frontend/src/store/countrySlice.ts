import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { fetchCountries, fetchCountriesByRegion, searchCountry } from '@/api/countryApi';

interface Country {
  name: string;
  population: number;
  flag: string;
  region: string;
  currencies: {
    name: string;
    symbol: string;
  }[];
  timezones: string[];
}

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  links: {
    current: string;
    next: string | null;
    prev: string | null;
    first: string;
    last: string;
  };
}

interface CountryState {
  countries: Country[];
  pagination: Pagination | null;
  isLoading: boolean;
  error: string | null;
}
const initialState: CountryState = {
  countries: [],
  pagination: null,
  isLoading: false,
  error: null,
};

export const getCountries = createAsyncThunk<
  { countries: Country[]; pagination: Pagination },
  { page: number; limit: number }
>('countries/fetch', async ({ page, limit }, { rejectWithValue }) => {
  try {
    const response = await fetchCountries(page, limit); // API call
    return {
      countries: response.data,
      pagination: response.pagination,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const getCountriesByRegion = createAsyncThunk<
  { countries: Country[]; pagination: Pagination },
  { region: string; page: number; limit: number },
  { rejectValue: string }
>('countries/fetchByRegion', async ({ region, page, limit }, { rejectWithValue }) => {
  try {
    const response = await fetchCountriesByRegion(region, page, limit);
    return {
      countries: response.data,
      pagination: response.pagination,
    };
  } catch (error: any) {
    return rejectWithValue(error.message);
  }
});

export const countrySearch = createAsyncThunk<
  { countries: Country[]; pagination: Pagination },
  { region?: string; capital?: string; name?: string; page: number; limit: number },
  { rejectValue: string }
>(
  'countries/countrySearch',
  async ({ region, capital, name, page, limit }, { rejectWithValue }) => {
    try {
      const response = await searchCountry(region, capital, name, page, limit);
      return {
        countries: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// country slice
const countrySlice = createSlice({
  name: 'countries',
  initialState,
  reducers: {
    clearCountries: (state) => {
      state.countries = [];
      state.pagination = null;
      state.error = null;
    },
    setCurrentRegion: (state, action: PayloadAction<string>) => {
      state.currentRegion = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle getCountries
      .addCase(getCountries.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getCountries.fulfilled,
        (state, action: PayloadAction<{ countries: Country[]; pagination: Pagination }>) => {
          state.isLoading = false;
          const { countries, pagination } = action.payload;

          if (pagination.currentPage === 1) {
            state.countries = countries;
          } else {
            // Prevent duplicate entries
            const existingIds = new Set(state.countries.map((c) => c.name));
            const newCountries = countries.filter((c) => !existingIds.has(c.name));
            state.countries = [...state.countries, ...newCountries];
          }

          state.pagination = pagination;
        }
      )
      .addCase(getCountries.rejected, (state, action) => {
        state.isLoading = false;
        state.error = (action.payload as string) || 'Failed to fetch countries';
      })
      // Handle getCountriesByRegion
      .addCase(getCountriesByRegion.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        getCountriesByRegion.fulfilled,
        (state, action: PayloadAction<{ countries: Country[]; pagination: Pagination }>) => {
          state.isLoading = false;
          const { countries, pagination } = action.payload;
          console.log(countries, pagination, 'fulfilled');
          if (pagination.currentPage === 1) {
            state.countries = countries;
          } else {
            const existingIds = new Set(state.countries.map((c) => c.name));
            const newCountries = countries.filter((c) => !existingIds.has(c.name));
            state.countries = [...state.countries, ...newCountries];
          }

          state.pagination = pagination;
        }
      )
      .addCase(getCountriesByRegion.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch countries by region';
      })
      .addCase(countrySearch.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(
        countrySearch.fulfilled,
        (state, action: PayloadAction<{ countries: Country[]; pagination: Pagination }>) => {
          state.isLoading = false;
          const { countries, pagination } = action.payload;
          console.log(countries, pagination, 'fulfilled');
          if (pagination.currentPage === 1) {
            state.countries = countries;
          } else {
            const existingIds = new Set(state.countries.map((c) => c.name));
            const newCountries = countries.filter((c) => !existingIds.has(c.name));
            state.countries = [...state.countries, ...newCountries];
          }

          state.pagination = pagination;
        }
      )
      .addCase(countrySearch.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload ?? 'Failed to fetch countries by region';
      });
  },
});

export const { clearCountries, setCurrentRegion } = countrySlice.actions;
export default countrySlice.reducer;

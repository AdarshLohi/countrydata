export interface Country {
  code: string;
  name: string;
  population: number;
  flag: string;
  region: string;
  currencies: {
    name: string;
    symbol: string;
  }[];
  timezones: string[];
  languages: string[];
}

export interface CountryList {
  countries: Country[];
}

export interface Pagination {
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

export interface CountryDetails {
  name: string;
  population: number;
  flag?: string;
  region: string;
  currencies: Currency[];
  timezones: string;
}

export interface Currency {
  name: string;
  symbol: string;
}

export interface CountryData {
  name: string;
  population: number;
  flag: string | null;
  region: string;
  currencies: Currency[];
  timezones: string[];
}

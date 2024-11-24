import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetchCountriesDetails } from '@/api/countryApi';

interface Country {
  capital: string;
  name: string;
  flag: string;
  region: string;
  population: number;
  currencies: { [key: string]: { name: string } };
  languages: { [key: string]: string };
  timezones: string[];
}

const CountryDetails = () => {
  const { code } = useParams<{ code: string }>();
  const [country, setCountry] = useState<Country | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getCountryData = async () => {
      try {
        setIsLoading(true);
        const response = await fetchCountriesDetails(code!); // Ensure code is not null
        setCountry(response.data[0]); // Assuming API returns an array
      } catch (err: any) {
        setError('Failed to fetch country details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    getCountryData();
  }, [code]);

  if (isLoading) return <p className='text-center text-gray-600'>Loading...</p>;
  if (error) return <p className='text-center text-red-500'>{error}</p>;
  if (!country) return <p className='text-center text-gray-600'>No country details available.</p>;

  return (
    <div className='min-h-screen bg-gray-100 p-6 flex flex-col items-center'>
      <h1 className='text-3xl font-bold text-gray-800 mb-6'>{country.name} - Details</h1>
      <div className='bg-white shadow-md rounded-lg p-6 w-full max-w-2xl'>
        <Link to='/'>
          <a className='text-black-500 hover:underline hover:text-blue-500'>GO-BACK</a>
        </Link>
        <img
          src={country.flag}
          alt={`${country.name} Flag`}
          className='w-32 h-20 object-cover rounded-md mb-4 mx-auto'
        />
        <div className='grid grid-cols-2 gap-4'>
          <div className='text-gray-700'>
            <h2 className='font-semibold'>Region:</h2>
            <p>{country.region || 'Data not available'}</p>
          </div>
          <div className='text-gray-700'>
            <h2 className='font-semibold'>Population:</h2>
            <p>{country.population?.toLocaleString() || 'Data not available'}</p>
          </div>
          <div className='text-gray-700'>
            <h2 className='font-semibold'>Currencies:</h2>
            <p>
              {Object.values(country.currencies || {})
                .map((currency: any) => currency.name)
                .join(', ') || 'Data not available'}
            </p>
          </div>
          <div className='text-gray-700'>
            <h2 className='font-semibold'>Languages:</h2>
            <p>{Object.values(country.languages || {}).join(', ') || 'Data not available'}</p>
          </div>
          <div className='text-gray-700'>
            <h2 className='font-semibold'>Time Zones:</h2>
            <p>{Object.values(country.timezones || {}).join(', ') || 'Data not available'}</p>
          </div>
          <div className='text-gray-700'>
            <h2 className='font-semibold'>Capital:</h2>
            <p>{Object.values(country.capital || {}).join(', ') || 'Data not available'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CountryDetails;

import React from 'react';
import Card from '@/components/Card';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Country } from '@/Types/CountryTypes';
import { Link } from 'react-router-dom';

interface CountryListProps {
  countries: Country[];
  isLoading: boolean;
  error: string | null;
  lastCardRef: React.RefObject<HTMLDivElement>;
  pagination: {
    currentPage: number;
    totalPages: number;
  } | null;
}

const CountryList = ({
  countries,
  isLoading,
  error,
  lastCardRef,
  pagination,
}: CountryListProps) => {
  // Loading skeleton component
  const LoadingSkeleton = () => (
    <>
      {[...Array(4)].map((_, index) => (
        <div key={index} className='w-full'>
          <Skeleton height={200} />
        </div>
      ))}
    </>
  );

  return (
    <div className='min-h-screen bg-gray-100 p-6'>
      <h1 className='text-2xl font-bold text-center mb-6'>Countries</h1>

      {error && (
        <div className='text-red-500 text-center mb-4'>Error loading countries: {error}</div>
      )}

      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6'>
        {countries?.map((country: Country, index: number) => (
          <div key={country.name} ref={index === countries.length - 1 ? lastCardRef : null}>
            <Link to={`/details/${country.code}`} className='block'>
              <Card
                name={country.name}
                flag={country.flag}
                region={country.region}
                timezones={country.timezones}
                population={0}
                currencies={[]}
              />
            </Link>
          </div>
        ))}

        {isLoading && <LoadingSkeleton />}
      </div>

      {pagination?.currentPage >= pagination?.totalPages && (
        <div className='text-center mt-6 text-gray-600'>No more countries to load</div>
      )}
    </div>
  );
};

export default CountryList;

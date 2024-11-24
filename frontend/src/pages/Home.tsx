import React, { useEffect, useRef, useCallback, useState } from 'react';
import Header from '@/components/Header';
import CountryList from './CountryList';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/store/store';
import { clearCountries, getCountries, getCountriesByRegion } from '@/store/countrySlice';

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { countries, pagination, isLoading, error } = useSelector(
    (state: RootState) => state.countries
  );

  // Use local state to track the current region
  const [currentRegion, setCurrentRegion] = useState('all');

  // Use ref to track if we're in the middle of a fetch
  const isFetchingRef = useRef(false);

  // Reference for the intersection observer
  const observerRef = useRef<IntersectionObserver | null>(null);
  // Reference for the last card element
  const lastCardRef = useRef<HTMLDivElement | null>(null);

  // Handle region change
  const handleRegionChange = useCallback(
    async (selectedRegion: string) => {
      try {
        setCurrentRegion(selectedRegion);
        dispatch(clearCountries());

        if (selectedRegion === 'all') {
          await dispatch(getCountries({ page: 1, limit: 20 })).unwrap();
        } else {
          await dispatch(
            getCountriesByRegion({
              region: selectedRegion,
              page: 1,
              limit: 20,
            })
          ).unwrap();
        }
      } catch (error) {
        console.error('Error changing region:', error);
      }
    },
    [dispatch]
  );

  // Fetch next page of data
  const fetchNextPage = useCallback(async () => {
    if (isFetchingRef.current || !pagination || !pagination.hasNextPage) return;

    try {
      isFetchingRef.current = true;
      const nextPage = pagination.currentPage + 1;

      if (currentRegion === 'all') {
        await dispatch(
          getCountries({
            page: nextPage,
            limit: pagination.itemsPerPage || 20,
          })
        ).unwrap();
      } else {
        await dispatch(
          getCountriesByRegion({
            region: currentRegion,
            page: nextPage,
            limit: pagination.itemsPerPage || 20,
          })
        ).unwrap();
      }
    } catch (error) {
      console.error('Error fetching next page:', error);
    } finally {
      isFetchingRef.current = false;
    }
  }, [dispatch, pagination, currentRegion]);

  // Intersection Observer callback
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const target = entries[0];
      if (target.isIntersecting && !isLoading && pagination?.hasNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, isLoading, pagination]
  );

  // Set up intersection observer
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '20px',
      threshold: 0.1,
    };

    const observer = new IntersectionObserver(handleObserver, options);
    observerRef.current = observer;

    return () => {
      if (observer) {
        observer.disconnect();
      }
    };
  }, [handleObserver]);

  // Observe last card
  useEffect(() => {
    const observer = observerRef.current;
    const lastCard = lastCardRef.current;

    if (lastCard && observer) {
      observer.disconnect(); // Clear previous observations
      observer.observe(lastCard);
    }

    return () => {
      if (lastCard && observer) {
        observer.unobserve(lastCard);
      }
    };
  }, [countries]); // Re-run when countries array changes

  // Initial load
  useEffect(() => {
    handleRegionChange('all');
    // Cleanup function
    return () => {
      dispatch(clearCountries());
    };
  }, []);

  // Debug logging
  useEffect(() => {
    console.log('Current state:', {
      currentRegion,
      countriesCount: countries?.length,
      paginationInfo: pagination,
      isLoading,
      error,
    });
  }, [currentRegion, countries, pagination, isLoading, error]);

  return (
    <div>
      <Header
        onRegionChange={handleRegionChange}
        isLoading={isLoading}
        currentRegion={currentRegion}
      />
      {countries && countries.length > 0 ? (
        <CountryList
          countries={countries}
          isLoading={isLoading}
          error={error}
          lastCardRef={lastCardRef}
          pagination={pagination}
        />
      ) : (
        <div className='flex justify-center items-center min-h-[200px]'>
          {isLoading ? (
            <p>Loading...</p>
          ) : error ? (
            <p className='text-red-500'>Error: {error}</p>
          ) : (
            <p>No countries found</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;

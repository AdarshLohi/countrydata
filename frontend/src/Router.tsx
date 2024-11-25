import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from '@/components/ErrorBoundary';

// Lazy loading components
const Home = lazy(() => import('@/pages/Home'));
const CountryDetails = lazy(() => import('@/pages/CountryDetails'));

// Fallback component
const Loading = () => <div>Loading...</div>;

function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route
            path='/'
            element={
              <ErrorBoundary>
                <Home />
              </ErrorBoundary>
            }
          />
          <Route
            path='details/:code'
            element={
              <ErrorBoundary>
                <CountryDetails />
              </ErrorBoundary>
            }
          />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default AppRouter;

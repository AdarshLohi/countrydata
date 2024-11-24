import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '@/pages/Home';
import CountryDetails from '@/pages/CountryDetails';
import ErrorBoundary from '@/components/ErrorBoundary';

function AppRouter() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}

export default AppRouter;

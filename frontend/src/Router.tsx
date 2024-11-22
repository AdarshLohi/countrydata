import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CountryList from './pages/CountryList';
import CountryDetails from './pages/CountryDetails';
import ErrorBoundary from './components/ErrorBoundary';

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={
            <ErrorBoundary>
              <CountryList />
            </ErrorBoundary>
          }
        />
        <Route
          path='details/:name'
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

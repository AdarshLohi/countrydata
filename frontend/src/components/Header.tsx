import { useCallback, useState } from 'react';
import { useDispatch } from 'react-redux';
import { debounce } from 'lodash';
import { Search } from 'lucide-react';
import { countrySearch } from '@/store/countrySlice';

interface HeaderProps {
  onRegionChange: (region: string) => void;
  isLoading: boolean;
}

const Header = ({ onRegionChange, isLoading }: HeaderProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch();
  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedRegion = event.target.value;
    onRegionChange(selectedRegion);
    debouncedSearch(searchTerm, selectedRegion);
  };

  const debouncedSearch = useCallback(
    debounce((searchValue: string, region: string, capital?: string) => {
      dispatch(
        countrySearch({
          region: region !== 'all' ? region : undefined,
          capital: capital,
          name: searchValue,
          page: 1,
          limit: 10,
        })
      );
    }, 300),
    []
  );

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    const select = document.querySelector('select') as HTMLSelectElement;
    const currentRegion = select ? select.value : 'all';

    debouncedSearch(value, currentRegion);
  };

  return (
    <header className='bg-white shadow-md'>
      <div className='container mx-auto px-4 py-3 flex items-center justify-between'>
        <div className='flex-grow max-w-sm'>
          <div className='relative'>
            <input
              type='text'
              value={searchTerm}
              onChange={handleSearchChange}
              placeholder='Search by country, capital...'
              className='w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
              disabled={isLoading}
            />
            <Search
              className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
              size={18}
            />
          </div>
          {isLoading && (
            <div className='absolute right-3 top-1/2 transform -translate-y-1/2'>
              <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500'></div>
            </div>
          )}
        </div>

        <div className='flex space-x-4 ml-4'>
          <select
            className='px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            aria-label='Select Region'
            onChange={handleRegionChange}
            defaultValue='all'
            disabled={isLoading}
          >
            <option value='all'>All Regions</option>
            <option value='Americas'>Americas</option>
            <option value='Europe'>Europe</option>
            <option value='Asia'>Asia</option>
            <option value='Africa'>Africa</option>
          </select>

          <select
            className='px-4 py-2 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500'
            aria-label='Select Timezone'
          >
            <option value='utc'>UTC</option>
            <option value='pst'>PST</option>
            <option value='est'>EST</option>
            <option value='cst'>CST</option>
            <option value='ist'>IST</option>
          </select>
        </div>
      </div>
    </header>
  );
};

export default Header;

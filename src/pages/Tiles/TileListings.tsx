import { CircleX, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

import { debounce } from 'lodash';

import { useGetTileListings } from '@/api/queries';
import { Input } from '@/components/ui/input';
import { useTypedTranslation } from '@/hooks';
import { TABLE_PAGE_SIZE } from '@/lib/constant';
import TileTable from '@/pages/Tiles/TileTable';
import Pagination from '@/shared/Pagination';
import TabManager from '@/shared/TabManager';

import { TILE_TABS } from './tileTabs';

function TileListings() {
  const { t } = useTypedTranslation();
  const [searchInput, setSearchInput] = useState('');

  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTab, setSelectedTab] = useState(TILE_TABS[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const selectTabIdStatus = selectedTab.id === 1 ? true : false;
  const isActiveTab = selectedTab.id === 0 ? undefined : selectTabIdStatus;
  const {
    data: tileListings,
    isLoading,
    isFetching,
  } = useGetTileListings({
    page: currentPage,
    pageSize: TABLE_PAGE_SIZE,
    search: searchInput,
    statusId: selectedTab.id,
    isActive: isActiveTab,
    sortBy: 'createdAt',
    sortDirection: 'desc',
  });
  const debouncedSearch = useMemo(
    () =>
      debounce((...args: unknown[]) => {
        const val = args[0] as string;
        setCurrentPage(1);
        setSearchInput(val);
      }, 500),
    []
  );
  useEffect(() => {
    debouncedSearch(searchTerm);
  }, [searchTerm, debouncedSearch]);

  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">
        {t('tile.listingHeading')}
      </h1>
      <p className="text-foreground">{t('tile.listingDescription')}</p>
      <div className="lg:flex justify-between gap-4 items-center">
        <TabManager
          tabs={TILE_TABS}
          activeTab={selectedTab}
          setActiveTab={setSelectedTab}
        />

        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>

          <Input
            type="text"
            placeholder={t('tile.searchPlaceholder')}
            value={searchTerm}
            onChange={({ target: { value } }) => setSearchTerm(value)}
            className="w-full rounded-lg pl-10 pr-10 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-3 flex items-center text-red-500 hover:text-red-600"
            >
              <CircleX size={18} />
            </button>
          )}
        </div>
      </div>
      <TileTable
        tableRows={tileListings?.success ? tileListings.data?.items || [] : []}
        loading={isLoading || isFetching}
      />
      <Pagination
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={
          tileListings?.success && !isLoading
            ? tileListings.data?.meta.totalPages || 0
            : 0
        }
      />
    </div>
  );
}

export default TileListings;

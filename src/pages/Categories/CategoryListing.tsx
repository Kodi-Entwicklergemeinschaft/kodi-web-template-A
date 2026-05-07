import { CircleX, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// import { useNavigate } from 'react-router-dom';
import { debounce } from 'lodash';

import { useGetCategories } from '@/api/queries';
import { Input } from '@/components/ui/input';
import { useTypedTranslation } from '@/hooks';
import { TABLE_PAGE_SIZE } from '@/lib/constant';
import CategoryTable from '@/pages/Categories/CategoryTable';
import Pagination from '@/shared/Pagination';

function CategoryListing() {
  const { t } = useTypedTranslation();
  // const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const {
    data: categoriesResponse,
    isLoading,
    isFetching,
  } = useGetCategories({
    page: currentPage,
    pageSize: TABLE_PAGE_SIZE,
    search: searchInput,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    showAll: true,
  });

  const categories =
    categoriesResponse?.success && Array.isArray(categoriesResponse.data?.items)
      ? categoriesResponse.data.items
      : [];

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
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t('category.listing.heading')}
          </h1>
          <p className="text-foreground">{t('category.listing.description')}</p>
        </div>
        {/* <Button
            onClick={() => navigate('/categories/create')}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            {t('category.listing.createBtn')}
          </Button> */}
      </div>

      <div className="lg:flex justify-between gap-4 items-center mb-4">
        <div className="relative w-full max-w-xs">
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
            <Search size={18} />
          </span>

          <Input
            type="text"
            placeholder={t('category.listing.searchPlaceholder')}
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

      <CategoryTable tableRows={categories} loading={isLoading || isFetching} />

      {categoriesResponse?.success &&
        categoriesResponse.data.meta.totalPages > 0 && (
          <Pagination
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={categoriesResponse.data.meta.totalPages}
          />
        )}
    </div>
  );
}

export default CategoryListing;

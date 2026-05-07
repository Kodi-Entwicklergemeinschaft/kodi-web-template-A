import { useMemo, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { useGetCityCategories, useGetCityList } from '@/api/queries';
import { useTypedTranslation } from '@/hooks';
import { TABLE_PAGE_SIZE } from '@/lib/constant';
import CategoryTable from '@/pages/Categories/CategoryTable';
import ROUTES from '@/route/routesConstant';
import Pagination from '@/shared/Pagination';

function CityCategoriesListing() {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const { data: cityListData } = useGetCityList();
  const [currentPage, setCurrentPage] = useState(1);
  const cityId = useMemo(
    () => (cityListData?.success ? cityListData.data.items[0].id || '' : ''),
    [cityListData]
  );
  const {
    data: categoriesApiData,
    isFetching,
    isLoading,
  } = useGetCityCategories({
    showAll: true,
    cityId: cityId,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: currentPage,
    pageSize: TABLE_PAGE_SIZE,
  });

  const categories =
    categoriesApiData?.success && Array.isArray(categoriesApiData.data.items)
      ? categoriesApiData.data.items
      : [];
  return (
    <div className="w-full px-1">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-semibold text-foreground">
            {t('category.listing.cityHeading')}
          </h1>
          <p className="text-foreground">
            {t('category.listing.cityDescription')}
          </p>
        </div>
        {/* <Button
            onClick={() => navigate('/categories/create')}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            {t('category.listing.createBtn')}
          </Button> */}
      </div>

      <CategoryTable
        tableRows={categories}
        loading={isLoading || isFetching}
        handleCustomEdit={(categoryId) => {
          const updateCatRoute = ROUTES.UpdateCityCategory.replace(
            ':cityId',
            cityId
          ).replace(':categoryId', categoryId);
          navigate(`${ROUTES.Categories}/${updateCatRoute}`);
        }}
        showDeleteAction={false}
      />

      {categoriesApiData?.success && categoriesApiData.data.meta.totalPages && (
        <Pagination
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={
            categoriesApiData?.success && !isLoading
              ? categoriesApiData.data?.meta.totalPages || 0
              : 0
          }
        />
      )}
    </div>
  );
}

export default CityCategoriesListing;

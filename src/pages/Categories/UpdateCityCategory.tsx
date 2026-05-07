import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useGetCityCategory } from '@/api/queries';
import { Spinner } from '@/components/ui/spinner';
import { useTypedTranslation } from '@/hooks';
import { USER_ROLE_MAP } from '@/lib/constant';
import { EditCityCategoryForm } from '@/schema/categoryUpload';
import { selectUserRole } from '@/store/slices/userSlice';
import { useGlobalStore } from '@/store/useGlobalStore';

import NewForm from './Form';

function UpdateCityCategory() {
  const { t } = useTypedTranslation();
  const userRole = useGlobalStore(selectUserRole);

  const { categoryId = '', cityId = '' } = useParams();
  const {
    data: categoryData,
    isFetching,
    isLoading,
  } = useGetCityCategory(cityId, categoryId);

  const categoriesData = useMemo(() => {
    if (categoryData?.success && categoryData.data) {
      const children = categoryData.data?.children?.map((c) => ({
        ...c,
        iconImageUrl: c.iconUrl,
        backgroundImageUrl: c.imageUrl,
        isActive: c.isActive ? 'true' : 'false',
      }));
      return {
        ...categoryData.data,
        iconImageUrl: categoryData.data.iconUrl,
        backgroundImageUrl: categoryData.data.imageUrl,
        isActive: categoryData.data.isActive ? 'true' : 'false',
        children,
      } as EditCityCategoryForm;
    }
    return;
  }, [categoryData]);

  if (isFetching || isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );

  if (!categoryData?.success || !categoryData.data)
    return <div>{t('category.create.categoryNotfound')}</div>;

  return (
    <div>
      <NewForm
        initialCategoriesData={categoriesData}
        categoryId={categoryId}
        cityId={cityId}
        showDeleteSubCategory={userRole === USER_ROLE_MAP.SUPER_ADMIN}
        showAddSubCategory={userRole === USER_ROLE_MAP.SUPER_ADMIN}
        editMode
      />
    </div>
  );
}

export default UpdateCityCategory;

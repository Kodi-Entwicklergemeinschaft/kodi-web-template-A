import { useMemo } from 'react';

import { useParams } from 'react-router-dom';

import { useGetCategory } from '@/api/queries';
import { Spinner } from '@/components/ui/spinner';
import { useTypedTranslation } from '@/hooks';
import { CreateCategoryForm } from '@/schema/categoryUpload';

import NewForm from './CategoryForm/NewForm';
function NewCategory() {
  const { t } = useTypedTranslation();
  const { categoryId = '' } = useParams();
  const {
    data: categoryData,
    isFetching,
    isLoading,
  } = useGetCategory(categoryId);

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
      } as CreateCategoryForm;
    }
    return;
  }, [categoryData]);

  if (isFetching || isLoading) return <Spinner className="size-8" />;
  if (!categoryData?.success || !categoryData.data)
    return <div>{t('category.create.categoryNotfound')}</div>;

  return (
    <div>
      <NewForm
        initialCategoriesData={categoriesData}
        showAddCategory={categoryId ? false : true}
      />
    </div>
  );
}

export default NewCategory;

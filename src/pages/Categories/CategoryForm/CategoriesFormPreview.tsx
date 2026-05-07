import { UseFormReturn, useWatch } from 'react-hook-form';

import CategoryPreview from '@/pages/Categories/CategoryPreview';
import { CreateCategoryForm } from '@/schema/categoryUpload';

type CategoriesFormPreviewProps = {
  categoriesForm: UseFormReturn<CreateCategoryForm>;
};

const CategoriesFormPreview = ({
  categoriesForm,
}: CategoriesFormPreviewProps) => {
  const categoryName = useWatch({
    control: categoriesForm.control,
    name: 'name',
  });
  const subtitle = useWatch({
    control: categoriesForm.control,
    name: 'subtitle',
  });
  const headerColor = useWatch({
    control: categoriesForm.control,
    name: 'headerBackgroundColor',
  });
  const categoryIcon = useWatch({
    control: categoriesForm.control,
    name: 'iconImageUrl',
  });
  const categoryDescription = useWatch({
    control: categoriesForm.control,
    name: 'description',
  });
  const contentColor = useWatch({
    control: categoriesForm.control,
    name: 'contentBackgroundColor',
  });
  const categoryImage = useWatch({
    control: categoriesForm.control,
    name: 'backgroundImageUrl',
  });

  return (
    <CategoryPreview
      {...{
        categoryName,
        subtitle,
        headerColor,
        categoryIcon,
        categoryDescription,
        contentColor,
        categoryImage,
      }}
    />
  );
};

export default CategoriesFormPreview;

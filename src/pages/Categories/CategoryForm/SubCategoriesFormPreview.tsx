import { UseFormReturn, useWatch } from 'react-hook-form';

import { useTypedTranslation } from '@/hooks';
import CategoryPreview from '@/pages/Categories/CategoryPreview';
import { CreateCategoryForm } from '@/schema/categoryUpload';

type SubCategoriesFormPreviewProps = {
  categoriesForm: UseFormReturn<CreateCategoryForm>;
};

const SubCategoriesFormPreview = ({
  categoriesForm,
}: SubCategoriesFormPreviewProps) => {
  const { t } = useTypedTranslation();
  const subCategories = useWatch({
    control: categoriesForm.control,
    name: 'children',
  });
  if (!subCategories || !subCategories.length) return null;

  return subCategories.map((subCategory) => (
    <CategoryPreview
      key={`preview-${subCategory.parentId}-${subCategory?.name}`}
      previewTitle={`${t(
        'category.create.preview.heading'
      )}: ${subCategory.name || 'Untitled'}`}
      {...{
        categoryName: subCategory.name,
        headerColor: subCategory.headerBackgroundColor,
        categoryIcon: subCategory.iconImageUrl,
        categoryImage: subCategory.backgroundImageUrl,
        categoryDescription: subCategory.description,
        contentColor: subCategory.contentBackgroundColor,
        subtitle: subCategory.subtitle,
        description: subCategory.description,
      }}
    />
  ));
};

export default SubCategoriesFormPreview;

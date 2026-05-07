import { UseFormReturn, useWatch } from 'react-hook-form';

import { useTypedTranslation } from '@/hooks';
import SubCategoryPreview from '@/pages/Categories/SubCategoryPreview';
import { EditCityCategoryForm } from '@/schema/categoryUpload';

type SubCategoriesFormPreviewProps = {
  categoriesForm: UseFormReturn<EditCityCategoryForm>;
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
    <SubCategoryPreview
      key={`preview-${subCategory.parentId}-${subCategory?.name}`}
      previewTitle={`${t('category.create.preview.cityHeading')}: ${subCategory.name || 'Untitled'}`}
      {...{
        categoryName: subCategory.name,
        headerColor: subCategory.headerBackgroundColor,
        // categoryIcon: subCategory.iconImageUrl,
        categoryImage: subCategory.backgroundImageUrl,
      }}
    />
  ));
};

export default SubCategoriesFormPreview;

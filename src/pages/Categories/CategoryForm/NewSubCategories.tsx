import { Plus, X } from 'lucide-react';

import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { useTypedTranslation } from '@/hooks';
import { CreateCategoryForm } from '@/schema/categoryUpload';
import {
  ColorPickerField,
  FileUploadField,
  FormSelectField,
  RichTextField,
  TextInputField,
} from '@/shared/FormField';

type NewSubCategoriesProps = {
  categoriesForm: UseFormReturn<CreateCategoryForm>;
  showAddCategory?: boolean;
  defaultCategory: CreateCategoryForm;
  isEdit?: boolean;
};

const NewSubCategories = ({
  categoriesForm,
  showAddCategory = true,
  defaultCategory,
  isEdit,
}: NewSubCategoriesProps) => {
  const { t } = useTypedTranslation();
  const { fields, append, remove } = useFieldArray({
    control: categoriesForm.control,
    name: 'children',
  });

  return (
    <>
      {showAddCategory && (
        <Button
          onClick={() => {
            append(defaultCategory);
          }}
          variant="outline"
          className="flex items-center gap-2 w-full"
          type="button"
          aria-label={t('category.create.addSubCategory')}
        >
          <Plus className="size-5" />
          {t('category.create.addSubCategory')}
        </Button>
      )}

      {fields.map((field, index) => {
        return (
          <div key={field.id} className="w-full mt-6 relative border-t pt-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">
                  {isEdit
                    ? t('category.create.subCategory.editHeading')
                    : t('category.create.subCategory.heading')}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {isEdit
                    ? t('category.create.subCategory.editDescription')
                    : t('category.create.subCategory.description')}
                </p>
              </div>
              {showAddCategory && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => remove(index)}
                  type="button"
                  aria-label={t('removeSubcategory')}
                >
                  <X className="size-4" />
                </Button>
              )}
            </div>

            <div className="space-y-4">
              <TextInputField
                name={`children.${index}.name`}
                control={categoriesForm.control}
                label={t('category.create.form.name.label')}
                placeholder={t('category.create.form.name.placeholder')}
                required
              />
              <TextInputField
                name={`children.${index}.subtitle`}
                control={categoriesForm.control}
                label={t('category.create.form.subtitle.label')}
                placeholder={t('category.create.form.subtitle.placeholder')}
                required
              />

              <ColorPickerField
                control={categoriesForm.control}
                name={`children.${index}.headerBackgroundColor`}
                label={t('category.create.form.headerColor.label')}
                required
              />
              <FileUploadField
                control={categoriesForm.control}
                name={`children.${index}.iconImageUrl`}
                label={t('category.create.form.icon.label')}
              />
              <RichTextField
                control={categoriesForm.control}
                name={`children.${index}.description`}
                label={t('category.create.form.description.label')}
                className="h-32 overflow-y-auto"
                placeholder={t('category.create.form.description.placeholder')}
                required
              />
              <ColorPickerField
                control={categoriesForm.control}
                // name="contentBackgroundColor"
                name={`children.${index}.contentBackgroundColor`}
                required
                label={t('category.create.form.contentColor.label')}
              />
              <FileUploadField
                control={categoriesForm.control}
                name={`children.${index}.backgroundImageUrl`}
                required
                label={t('category.create.form.backgroundImage.label')}
              />

              <FormSelectField
                control={categoriesForm.control}
                name={`children.${index}.isActive`}
                label={t('category.create.form.isActive.label')}
                placeholder={t('category.create.form.isActive.placeholder')}
                options={[
                  {
                    value: 'true',
                    label: t('category.create.form.isActive.active'),
                  },
                  {
                    value: 'false',
                    label: t('category.create.form.isActive.inactive'),
                  },
                ]}
              />
            </div>
          </div>
        );
      })}
    </>
  );
};

export default NewSubCategories;

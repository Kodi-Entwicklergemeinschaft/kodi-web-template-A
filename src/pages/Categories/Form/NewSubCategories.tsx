import { Plus, X } from 'lucide-react';

import { useFieldArray, UseFormReturn } from 'react-hook-form';

import { Button } from '@/components/ui/button';
import { useTypedTranslation } from '@/hooks';
import { EditCityCategoryForm } from '@/schema/categoryUpload';
import {
  ColorPickerField,
  FileUploadField,
  FormSelectField,
  TextInputField,
} from '@/shared/FormField';

type NewSubCategoriesProps = {
  categoriesForm: UseFormReturn<EditCityCategoryForm>;
  defaultCategory: EditCityCategoryForm;
  showAddSubCategory?: boolean;
  showDeleteSubCategory?: boolean;
  editMode?: boolean;
};

const NewSubCategories = ({
  categoriesForm,
  showAddSubCategory,
  showDeleteSubCategory,
  defaultCategory,
  editMode,
}: NewSubCategoriesProps) => {
  const { t } = useTypedTranslation();
  const { fields, append, remove } = useFieldArray({
    control: categoriesForm.control,
    name: 'children',
  });

  return (
    <>
      {showAddSubCategory && (
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
                  {editMode
                    ? t('category.create.subCategory.editHeading')
                    : t('category.create.subCategory.heading')}
                </h3>
                {/* <p className="text-sm text-muted-foreground">
                  {t('category.create.subCategory.editDescription')}
                </p> */}
              </div>
              {showDeleteSubCategory && (
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

              <ColorPickerField
                control={categoriesForm.control}
                name={`children.${index}.headerBackgroundColor`}
                label={t('category.create.form.headerColor.label')}
              />

              <FileUploadField
                control={categoriesForm.control}
                name={`children.${index}.backgroundImageUrl`}
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

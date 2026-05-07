import { X } from 'lucide-react';
import { useEffect, useState } from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import {
  SubCategoryUploadForm,
  subCategoryUploadSchema,
} from '@/schema/categoryUpload';
import {
  ColorPickerField,
  FileUploadField,
  FormSelectField,
  TextInputField,
} from '@/shared/FormField';

interface SubCategoryFormProps {
  id: number;
  onRemove: (id: number) => void;
  onDataChange: (id: number, data: SubCategoryData) => void;
  onRegisterValidation: (
    id: number,
    validateFn: () => Promise<boolean>
  ) => void;
  onRegisterReset?: (
    id: number,
    resetFn: (values?: SubCategoryData) => void
  ) => void;
  initialValues?: SubCategoryData;
}

export interface SubCategoryData {
  name: string;
  headerBackgroundColor: string;
  iconImageUrl: File | string | null;
  backgroundImageUrl: File | string | null;
  categoryId?: string; // server id for existing sub-categories
  parentId?: string | null;
  isActive?: 'true' | 'false';
}

// todo
// 1.sprate the code
// 2.light testing

function SubCategoryFormFields({
  id,
  onRemove,
  onDataChange,
  onRegisterValidation,
  onRegisterReset,
  initialValues,
}: SubCategoryFormProps) {
  const { t } = useTypedTranslation();
  const [hasValidated, setHasValidated] = useState(false);

  const subForm = useForm<SubCategoryUploadForm>({
    resolver: zodResolver(subCategoryUploadSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: initialValues?.name ?? '',
      headerBackgroundColor: initialValues?.headerBackgroundColor ?? '',
      iconImageUrl: initialValues?.iconImageUrl ?? null,
      backgroundImageUrl: initialValues?.backgroundImageUrl ?? null,
      parentId: initialValues?.parentId ?? null,
      isActive: initialValues?.isActive ?? 'false',
    },
  });

  // Reset form when initialValues change (for edit mode)
  useEffect(() => {
    if (initialValues) {
      subForm.reset({
        name: initialValues.name ?? '',
        headerBackgroundColor: initialValues.headerBackgroundColor ?? '',
        iconImageUrl: initialValues.iconImageUrl ?? null,
        backgroundImageUrl: initialValues.backgroundImageUrl ?? null,
        parentId: initialValues.parentId ?? null,
        isActive: initialValues.isActive ?? 'false',
      });
    }
  }, [initialValues, subForm]);

  // Watch form fields for preview
  const subCategoryName = useWatch({ control: subForm.control, name: 'name' });
  const subHeaderColor = useWatch({
    control: subForm.control,
    name: 'headerBackgroundColor',
  });
  const subCategoryIcon = useWatch({
    control: subForm.control,
    name: 'iconImageUrl',
  });

  const subCategoryImage = useWatch({
    control: subForm.control,
    name: 'backgroundImageUrl',
  });
  const subIsActive = useWatch({
    control: subForm.control,
    name: 'isActive',
  });

  // Revalidate on change after initial validation
  useEffect(() => {
    if (hasValidated) {
      subForm.trigger();
    }
  }, [
    hasValidated,
    subCategoryName,
    subHeaderColor,
    subCategoryIcon,
    subCategoryImage,
    subIsActive,
    subForm,
  ]);

  // Update parent component whenever data changes
  useWatch({
    control: subForm.control,
    name: [
      'name',
      'subtitle',
      'headerBackgroundColor',
      'iconImageUrl',
      'description',
      'contentBackgroundColor',
      'backgroundImageUrl',
      'isActive',
    ],
    defaultValue: {},
  });

  // Notify parent of data changes
  useEffect(() => {
    onDataChange(id, {
      name: subCategoryName,
      headerBackgroundColor: subHeaderColor,
      iconImageUrl: subCategoryIcon,
      backgroundImageUrl: subCategoryImage,
      categoryId: initialValues?.categoryId, // Preserve server ID for existing subcategories
      parentId: initialValues?.parentId,
      isActive: subIsActive,
    });
  }, [
    id,
    subCategoryName,
    subHeaderColor,
    subCategoryIcon,
    subCategoryImage,
    subIsActive,
    initialValues?.categoryId,
    initialValues?.parentId,
    onDataChange,
  ]);

  // Register validation function with parent
  useEffect(() => {
    const validateForm = async () => {
      setHasValidated(true); // Enable onChange validation after first validation
      const isValid = await subForm.trigger();
      if (!isValid) {
        const errors = subForm.formState.errors;
        console.error('SubCategory Validation Errors:', {
          subCategoryId: id,
          errors: errors,
          formValues: subForm.getValues(),
        });
        toast.error(t('category.create.subCategory.subCategory_validation'));
      }
      return isValid;
    };
    onRegisterValidation(id, validateForm);
    if (onRegisterReset)
      onRegisterReset(id, (values?: SubCategoryData) => {
        if (values) {
          subForm.reset({
            name: values.name ?? '',
            headerBackgroundColor: values.headerBackgroundColor ?? '',
            iconImageUrl: values.iconImageUrl ?? null,
            backgroundImageUrl: values.backgroundImageUrl ?? null,
            parentId: values.parentId ?? null,
            isActive: (values.isActive as 'true' | 'false') ?? 'false',
          });
        } else {
          subForm.reset({
            name: '',
            subtitle: '',
            description: '',
            headerBackgroundColor: '',
            contentBackgroundColor: '',
            iconImageUrl: null,
            backgroundImageUrl: null,
            parentId: null,
            isActive: 'false',
          });
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, subForm, onRegisterValidation, onRegisterReset, subCategoryName]);

  return (
    <div className="w-full mt-6 relative border-t pt-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            {t('category.create.subCategory.heading')}
          </h3>
          <p className="text-sm text-muted-foreground">
            {t('category.create.subCategory.description')}
          </p>
        </div>
        <Button
          variant="destructive"
          size="icon"
          onClick={() => onRemove(id)}
          type="button"
          aria-label={t('removeSubcategory')}
        >
          <X className="size-4" />
        </Button>
      </div>

      <Form {...subForm}>
        <div className="space-y-4">
          <TextInputField
            name="name"
            control={subForm.control}
            label={t('category.create.form.name.label')}
            placeholder={t('category.create.form.name.placeholder')}
            required
          />

          <ColorPickerField
            control={subForm.control}
            name="headerBackgroundColor"
            label={t('category.create.form.headerColor.label')}
            required
          />

          <FileUploadField
            control={subForm.control}
            name="backgroundImageUrl"
            required
            label={t('category.create.form.backgroundImage.label')}
          />

          <FormSelectField
            control={subForm.control}
            name="isActive"
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
      </Form>
    </div>
  );
}

export default SubCategoryFormFields;

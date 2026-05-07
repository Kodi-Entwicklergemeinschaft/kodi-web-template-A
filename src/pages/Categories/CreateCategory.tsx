import { Plus, RotateCcw, SaveAll, X } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  CategoryData,
  EditCategoryUploadPayload,
} from '@/api/endpoints/categories';
import {
  useCreateCategory,
  useDeleteCategory,
  useDeleteCategoryIcon,
  useEditCategory,
  useGetCategory,
  useUploadCategoryIcon,
  useUploadCategoryImage,
} from '@/api/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { useTypedTranslation } from '@/hooks';
import CategoryPreview from '@/pages/Categories/CategoryPreview';
import {
  CategoryUploadForm,
  categoryUploadSchema,
} from '@/schema/categoryUpload';
import {
  ColorPickerField,
  FileUploadField,
  FormSelectField,
  RichTextField,
  TextInputField,
} from '@/shared/FormField';

type CategoryGetPayload = CategoryData & {
  iconImageUrl?: string | null;
  backgroundImageUrl?: string | null;
};

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
  onDeleteIcon?: () => void;
  initialValues?: SubCategoryData;
}

interface SubCategoryData {
  name: string;
  subtitle: string;
  headerBackgroundColor: string;
  iconImageUrl: File | string | null;
  description: string;
  contentBackgroundColor: string;
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
  onDeleteIcon,
  onRegisterReset,
  initialValues,
}: SubCategoryFormProps) {
  const { t } = useTypedTranslation();
  const [hasValidated, setHasValidated] = useState(false);

  const subForm = useForm<CategoryUploadForm>({
    resolver: zodResolver(categoryUploadSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: initialValues?.name ?? '',
      subtitle: initialValues?.subtitle ?? '',
      description: initialValues?.description ?? '',
      headerBackgroundColor: initialValues?.headerBackgroundColor ?? '',
      contentBackgroundColor: initialValues?.contentBackgroundColor ?? '',
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
        subtitle: initialValues.subtitle ?? '',
        description: initialValues.description ?? '',
        headerBackgroundColor: initialValues.headerBackgroundColor ?? '',
        contentBackgroundColor: initialValues.contentBackgroundColor ?? '',
        iconImageUrl: initialValues.iconImageUrl ?? null,
        backgroundImageUrl: initialValues.backgroundImageUrl ?? null,
        parentId: initialValues.parentId ?? null,
        isActive: initialValues.isActive ?? 'false',
      });
    }
  }, [initialValues, subForm]);

  // Watch form fields for preview
  const subCategoryName = useWatch({ control: subForm.control, name: 'name' });
  const subSubtitle = useWatch({ control: subForm.control, name: 'subtitle' });
  const subHeaderColor = useWatch({
    control: subForm.control,
    name: 'headerBackgroundColor',
  });
  const subCategoryIcon = useWatch({
    control: subForm.control,
    name: 'iconImageUrl',
  });
  const subCategoryDescription = useWatch({
    control: subForm.control,
    name: 'description',
  });
  const subContentColor = useWatch({
    control: subForm.control,
    name: 'contentBackgroundColor',
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
    subSubtitle,
    subHeaderColor,
    subCategoryIcon,
    subCategoryDescription,
    subContentColor,
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
      subtitle: subSubtitle,
      headerBackgroundColor: subHeaderColor,
      iconImageUrl: subCategoryIcon,
      description: subCategoryDescription,
      contentBackgroundColor: subContentColor,
      backgroundImageUrl: subCategoryImage,
      categoryId: initialValues?.categoryId, // Preserve server ID for existing subcategories
      parentId: initialValues?.parentId,
      isActive: subIsActive,
    });
  }, [
    id,
    subCategoryName,
    subSubtitle,
    subHeaderColor,
    subCategoryIcon,
    subCategoryDescription,
    subContentColor,
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
            subtitle: values.subtitle ?? '',
            description: values.description ?? '',
            headerBackgroundColor: values.headerBackgroundColor ?? '',
            contentBackgroundColor: values.contentBackgroundColor ?? '',
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

          <TextInputField
            name="subtitle"
            control={subForm.control}
            label={t('category.create.form.subtitle.label')}
            placeholder={t('category.create.form.subtitle.placeholder')}
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
            name="iconImageUrl"
            label={t('category.create.form.icon.label')}
            onDelete={onDeleteIcon}
          />

          <RichTextField
            name="description"
            control={subForm.control}
            label={t('category.create.form.description.label')}
            className="h-32 overflow-y-auto"
            placeholder={t('category.create.form.description.placeholder')}
            required
          />

          <ColorPickerField
            control={subForm.control}
            name="contentBackgroundColor"
            required
            label={t('category.create.form.contentColor.label')}
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

function CreateCategory() {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const createCategory = useCreateCategory();
  const editCategory = useEditCategory();
  const deleteCategory = useDeleteCategory();
  const deleteCategoryIcon = useDeleteCategoryIcon();
  const [searchParams] = useSearchParams();
  const categoryId = searchParams.get('id');
  const getCategoryQuery = useGetCategory(categoryId ?? '');
  const uploadIcon = useUploadCategoryIcon();
  const uploadImage = useUploadCategoryImage();
  const [subCategories, setSubCategories] = useState<number[]>([]);
  const [subCategoriesData, setSubCategoriesData] = useState<
    Record<number, SubCategoryData>
  >({});
  const [subCategoriesValidation, setSubCategoriesValidation] = useState<
    Record<number, () => Promise<boolean>>
  >({});
  const [subCategoriesReset, setSubCategoriesReset] = useState<
    Record<number, (values?: SubCategoryData) => void>
  >({});
  const [initialMainValues, setInitialMainValues] =
    useState<Partial<CategoryUploadForm> | null>(null);
  const [initialSubCategoriesData, setInitialSubCategoriesData] = useState<
    Record<number, SubCategoryData>
  >({});
  const [deletedSubCategoryIds, setDeletedSubCategoryIds] = useState<string[]>(
    []
  );
  const [hasValidated, setHasValidated] = useState(false);

  const form = useForm<CategoryUploadForm>({
    resolver: zodResolver(categoryUploadSchema),
    mode: 'onSubmit',
    defaultValues: {
      name: '',
      subtitle: '',
      description: '',
      headerBackgroundColor: '',
      contentBackgroundColor: '',
      iconImageUrl: null,
      backgroundImageUrl: null,
      parentId: null,
      isActive: 'false',
    },
  });

  // If categoryId provided via query params, fetch details and populate the form
  useEffect(() => {
    if (!categoryId) return;
    const resp = getCategoryQuery.data;
    if (!resp || !('data' in resp) || !resp.success) return;
    const categoryPayload = resp.data as CategoryGetPayload;

    // Helper to add cache-busting parameter to image URLs
    const addCacheBuster = (url: string | null | undefined) => {
      if (!url) return null;
      if (typeof url !== 'string') return url;
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}t=${Date.now()}`;
    };

    // Reset main category form values
    const mainResetValues: CategoryUploadForm = {
      name: categoryPayload.name ?? '',
      subtitle: categoryPayload.subtitle ?? '',
      description: categoryPayload.description ?? '',
      headerBackgroundColor: categoryPayload.headerBackgroundColor ?? '',
      contentBackgroundColor: categoryPayload.contentBackgroundColor ?? '',
      iconImageUrl: addCacheBuster(
        categoryPayload.iconUrl ?? categoryPayload.iconImageUrl
      ),
      backgroundImageUrl: addCacheBuster(
        categoryPayload.imageUrl ?? categoryPayload.backgroundImageUrl
      ),
      parentId: categoryPayload.parentId ?? null,
      isActive: (categoryPayload.isActive ? 'true' : 'false') as
        | 'true'
        | 'false',
    };
    form.reset(mainResetValues);
    // Use setTimeout to avoid sync setState inside effect
    setTimeout(() => setInitialMainValues(mainResetValues), 0);

    // Populate sub-categories if any
    const children = categoryPayload.children ?? [];
    if (Array.isArray(children) && children.length > 0) {
      const newKeys: number[] = [];
      const newData: Record<number, SubCategoryData> = {};
      const newValidation: Record<number, () => Promise<boolean>> = {};

      children.forEach((child: CategoryData) => {
        const key = Date.now() + Math.floor(Math.random() * 1000);
        newKeys.push(key);
        newData[key] = {
          name: child.name ?? '',
          subtitle: child.subtitle ?? '',
          headerBackgroundColor: child.headerBackgroundColor ?? '',
          iconImageUrl: addCacheBuster(child.iconUrl),
          description: child.description ?? '',
          contentBackgroundColor: child.contentBackgroundColor ?? '',
          backgroundImageUrl: addCacheBuster(child.imageUrl),
          categoryId: child.id,
          parentId: child.parentId ?? categoryId,
          isActive: child.isActive ? 'true' : 'false',
        };
      });

      // Batch state updates asynchronously to avoid cascading re-renders in effect
      setTimeout(() => {
        setSubCategories(newKeys);
        setSubCategoriesData(newData);
        setSubCategoriesValidation(newValidation);
        setInitialSubCategoriesData(newData);
      }, 0);
    }
  }, [categoryId, form, getCategoryQuery.data]);

  const addSubCategory = () => {
    setSubCategories((prev) => [...prev, Date.now()]);
  };

  const removeSubCategory = (id: number) => {
    // Check if this subcategory has a server ID (existing subcategory)
    const subData = subCategoriesData[id];
    if (subData?.categoryId) {
      // Track it for deletion
      setDeletedSubCategoryIds((prev) => [
        ...prev,
        subData.categoryId as string,
      ]);
    }

    setSubCategories((prev) => prev.filter((subId) => subId !== id));
    setSubCategoriesData((prev) => {
      const newData = { ...prev };
      delete newData[id];
      return newData;
    });
    setSubCategoriesValidation((prev) => {
      const newValidation = { ...prev };
      delete newValidation[id];
      return newValidation;
    });
    setSubCategoriesReset((prev) => {
      const newReset = { ...prev };
      delete newReset[id];
      return newReset;
    });
  };

  const handleSubCategoryDataChange = useCallback(
    (id: number, data: SubCategoryData) => {
      setSubCategoriesData((prev) => ({
        ...prev,
        [id]: data,
      }));
    },
    []
  );

  const handleRegisterValidation = useCallback(
    (id: number, validateFn: () => Promise<boolean>) => {
      setSubCategoriesValidation((prev) => ({
        ...prev,
        [id]: validateFn,
      }));
    },
    []
  );

  const handleRegisterReset = useCallback(
    (id: number, resetFn: (values?: SubCategoryData) => void) => {
      setSubCategoriesReset((prev) => ({ ...prev, [id]: resetFn }));
    },
    []
  );

  // Handler for deleting main category icon
  const handleDeleteMainCategoryIcon = useCallback(() => {
    if (!categoryId) {
      toast.error(t('category.create.icon.not_delete_icon'));
      return;
    }

    deleteCategoryIcon.mutate(
      { id: categoryId },
      {
        onSuccess: (resp) => {
          // If onSuccess is called, the HTTP request was successful (2xx status)
          // Handle empty response or response without error as success
          if (
            !resp ||
            typeof resp !== 'object' ||
            (resp.success !== false && !('error' in resp))
          ) {
            toast.success(t('category.create.icon.icon_delete_success'));
            form.setValue('iconImageUrl', null);
          } else {
            toast.error(t('category.create.icon.failed_delete'));
          }
        },
        onError: (error: Error) => {
          toast.error(
            error?.message || t('category.create.icon.failed_delete')
          );
        },
      }
    );
  }, [categoryId, deleteCategoryIcon, form, t]);

  // Handler for deleting subcategory icon
  const handleDeleteSubCategoryIcon = useCallback(
    (subId: number) => {
      const subData = subCategoriesData[subId];
      const subCategoryServerId = subData?.categoryId;

      if (!subCategoryServerId) {
        toast.error(t('category.create.subcategory.no_sub_id'));
        return;
      }

      deleteCategoryIcon.mutate(
        { id: subCategoryServerId },
        {
          onSuccess: (resp) => {
            // If onSuccess is called, the HTTP request was successful (2xx status)
            // Handle empty response or response without error as success
            if (
              !resp ||
              typeof resp !== 'object' ||
              (resp.success !== false && !('error' in resp))
            ) {
              const message =
                resp &&
                typeof resp === 'object' &&
                'message' in resp &&
                typeof resp.message === 'string'
                  ? resp.message
                  : undefined;
              toast.success(
                t('category.create.icon.icon_delete_success') || message
              );
              // Update the subcategory data to clear the icon
              setSubCategoriesData((prev) => ({
                ...prev,
                [subId]: {
                  ...prev[subId],
                  iconImageUrl: null,
                },
              }));
            } else {
              const errorMsg =
                'error' in resp && typeof resp.error === 'string'
                  ? resp.error
                  : 'Failed to delete icon';
              toast.error(t('category.create.icon.failed_delete') || errorMsg);
            }
          },
          onError: (error: Error) => {
            toast.error(
              t('category.create.icon.failed_delete') || error?.message
            );
          },
        }
      );
    },
    [subCategoriesData, deleteCategoryIcon, t]
  );

  // Watch form fields for preview
  const categoryName = useWatch({ control: form.control, name: 'name' });
  const subtitle = useWatch({ control: form.control, name: 'subtitle' });
  const headerColor = useWatch({
    control: form.control,
    name: 'headerBackgroundColor',
  });
  const categoryIcon = useWatch({
    control: form.control,
    name: 'iconImageUrl',
  });
  const categoryDescription = useWatch({
    control: form.control,
    name: 'description',
  });
  const contentColor = useWatch({
    control: form.control,
    name: 'contentBackgroundColor',
  });
  const categoryImage = useWatch({
    control: form.control,
    name: 'backgroundImageUrl',
  });

  // Revalidate main form on change after initial validation
  useEffect(() => {
    if (hasValidated) {
      form.trigger();
    }
  }, [
    hasValidated,
    categoryName,
    subtitle,
    headerColor,
    categoryIcon,
    categoryDescription,
    contentColor,
    categoryImage,
    form,
  ]);

  const handleFormSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      try {
        // Validate sub-category count
        // Sub-categories are completely optional (0, 1, 2, or 3 are all allowed)
        // Maximum is 3 (this is already prevented by UI, but double check here)
        // if (subCategories.length > 3) {
        //   toast.error(t('category.create.subCategory.cannotadd3subCategory'));
        //   return;
        // }

        // Enable onChange validation for all forms after first validation attempt
        setHasValidated(true);

        // Trigger validation on main form
        const mainFormValidation = form.trigger();

        // Only validate sub-categories if they exist
        const subCategoryValidations =
          subCategories.length > 0
            ? subCategories.map(async (subId) => {
                const validateFn = subCategoriesValidation[subId];
                if (validateFn) {
                  return await validateFn();
                }
                return true;
              })
            : [];

        // Wait for all validations to complete at the same time
        const [mainFormValid, ...subCategoryResults] = await Promise.all([
          mainFormValidation,
          ...subCategoryValidations,
        ]);
        // Check if all validations passed
        const allSubCategoriesValid =
          subCategoryResults.length === 0 ||
          subCategoryResults.every((result) => result === true);

        if (!mainFormValid || !allSubCategoriesValid) {
          if (!mainFormValid) {
            toast.error(t('category.create.fix_main_category'));
          }
          if (!allSubCategoriesValid) {
            toast.error(t('category.create.subCategory.fix_sub_category'));
          }
          return;
        }

        // If all validations passed, get form data and submit
        const data = form.getValues();

        // Helper function to extract file from File object
        const extractFile = async (raw: string | File | null) => {
          if (!raw || typeof raw === 'string') return null;
          return raw;
        };

        // Helper function to upload images for a category
        const uploadImages = async (
          categoryId: string,
          iconRaw: File | string | null | undefined,
          bgRaw: File | string | null | undefined
        ) => {
          const iconFile =
            iconRaw instanceof File ? await extractFile(iconRaw) : null;
          const bgFile =
            bgRaw instanceof File ? await extractFile(bgRaw) : null;

          const uploadPromises = [];

          // Upload Icon
          if (iconFile) {
            uploadPromises.push(
              new Promise((resolve, reject) => {
                uploadIcon.mutate(
                  {
                    id: categoryId,
                    file: iconFile,
                  },
                  {
                    onSuccess: resolve,
                    onError: reject,
                  }
                );
              })
            );
          }

          // Upload Background Image
          if (bgFile) {
            uploadPromises.push(
              new Promise((resolve, reject) => {
                uploadImage.mutate(
                  {
                    id: categoryId,
                    file: bgFile,
                  },
                  {
                    onSuccess: resolve,
                    onError: reject,
                  }
                );
              })
            );
          }

          // Wait for all uploads to complete
          if (uploadPromises.length > 0) {
            await Promise.all(uploadPromises);
          }
        };

        // Helper function to create a subcategory
        const createSubCategory = async (
          subCategoryData: SubCategoryData,
          parentId: string
        ) => {
          const { iconImageUrl, backgroundImageUrl, ...restSubData } =
            subCategoryData;

          const subCategoryPayload = {
            ...restSubData,
            parentId: parentId,
            isActive: true,
          };

          return new Promise<string>((resolve, reject) => {
            createCategory.mutate(subCategoryPayload, {
              onSuccess: async (resp) => {
                if (!resp.success) {
                  toast.error(resp.error);
                  reject(
                    new Error(resp.error || 'Failed to create sub-category')
                  );
                  return;
                }

                const subCategoryId = resp.data?.id;
                if (!subCategoryId) {
                  reject(new Error('No subcategory ID returned'));
                  return;
                }

                // Upload images for subcategory
                try {
                  await uploadImages(
                    subCategoryId,
                    iconImageUrl,
                    backgroundImageUrl
                  );
                  resolve(subCategoryId);
                } catch (error) {
                  console.error('Error uploading subcategory images:', error);
                  reject(error);
                }
              },
              onError: (error) => {
                console.error('Error creating subcategory:', error);
                reject(error);
              },
            });
          });
        };

        // Prepare main category payload (exclude File objects)
        const { iconImageUrl, backgroundImageUrl, ...restData } = data;
        const mainCategoryPayload = {
          ...restData,
          isActive: data.isActive === 'true',
          // TODO: STatic Data Update Later
          cities: [
            {
              cityId: '22a7b284-76aa-43a7-a3ec-797f0c045182',
            },
          ],
        };

        // Step 1: Create or update main category
        if (!categoryId) {
          createCategory.mutate(mainCategoryPayload, {
            onSuccess: async (resp) => {
              if (!resp.success) {
                toast.error(resp.error || 'Failed to create category');
                return;
              }

              const categoryIdResp = resp.data?.id;
              if (!categoryIdResp) {
                toast.error('No category ID returned');
                return;
              }

              try {
                // Step 2: Upload images for main category
                await uploadImages(
                  categoryIdResp,
                  iconImageUrl,
                  backgroundImageUrl
                );

                // Step 3: Create sub-categories if any
                if (subCategories.length > 0) {
                  toast.info('Creating sub-categories...');

                  for (const subId of subCategories) {
                    const subData = subCategoriesData[subId];
                    if (subData) {
                      try {
                        await createSubCategory(subData, categoryIdResp);
                      } catch (error) {
                        console.error(
                          `Error creating subcategory ${subId}:`,
                          error
                        );
                        toast.error(
                          t(
                            'category.create.subCategory.failed_create_subcategory'
                          )
                        );
                      }
                    }
                  }

                  toast.success(t('category.create.cat_and_subCate_created'));
                } else {
                  toast.success(resp.message);
                }

                navigate('/categories/listing');
              } catch (error) {
                console.error('Error in post-creation process:', error);
                toast.error(t('category.create.categoryCreate_image_failed'));
                navigate('/categories/listing');
              }
            },
            onError: (error) => {
              toast.error('Failed to create category');
              console.error('Error creating category:', error);
            },
          });
        } else {
          // EDIT flow
          editCategory.mutate(
            { categoryId, payload: mainCategoryPayload },
            {
              onSuccess: async (resp) => {
                if (!resp.success) {
                  toast.error(resp.error);
                  return;
                }

                const categoryIdResp = resp.data?.id;
                if (!categoryIdResp) {
                  toast.error('No category ID returned');
                  return;
                }

                try {
                  // Step 2: Upload images for main category using ID from response
                  await uploadImages(
                    categoryIdResp,
                    iconImageUrl,
                    backgroundImageUrl
                  );

                  // Step 2.5: Delete removed subcategories
                  if (deletedSubCategoryIds.length > 0) {
                    for (const deletedId of deletedSubCategoryIds) {
                      try {
                        await new Promise((resolve, reject) => {
                          deleteCategory.mutate(deletedId, {
                            onSuccess: resolve,
                            onError: reject,
                          });
                        });
                      } catch (error) {
                        console.error('Error deleting subcategory:', error);
                        // Continue with other operations even if delete fails
                      }
                    }
                  }

                  // Step 3: Handle sub-categories: update existing or create new
                  if (subCategories.length > 0) {
                    for (const subId of subCategories) {
                      const subData = subCategoriesData[subId];
                      if (!subData) continue;

                      const s = subData as SubCategoryData;
                      const subIcon = s.iconImageUrl;
                      const subBg = s.backgroundImageUrl;
                      const subCategoryServerId = s.categoryId;

                      if (subCategoryServerId) {
                        // Update existing subcategory
                        const restSubPayload: EditCategoryUploadPayload = {
                          name: s.name,
                          subtitle: s.subtitle,
                          description: s.description,
                          headerBackgroundColor: s.headerBackgroundColor,
                          contentBackgroundColor: s.contentBackgroundColor,
                          parentId: categoryIdResp, // Use parent ID from main category response
                          isActive: s.isActive === 'true',
                        };
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const subResp = await new Promise<any>(
                          (resolve, reject) => {
                            editCategory.mutate(
                              {
                                categoryId: subCategoryServerId,
                                payload: restSubPayload,
                              },
                              { onSuccess: resolve, onError: reject }
                            );
                          }
                        );

                        // Get subcategory ID from response
                        const subCategoryIdResp = subResp?.data?.id;
                        if (subCategoryIdResp) {
                          // Upload subcategory images using ID from response
                          await uploadImages(subCategoryIdResp, subIcon, subBg);
                        }
                      } else {
                        // Create new subcategory - call createCategory API
                        const newSubPayload = {
                          name: s.name,
                          subtitle: s.subtitle,
                          description: s.description,
                          headerBackgroundColor: s.headerBackgroundColor,
                          contentBackgroundColor: s.contentBackgroundColor,
                          parentId: categoryIdResp, // Use parent ID from main category response
                          isActive: s.isActive === 'true',
                        };
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        const newSubResp = await new Promise<any>(
                          (resolve, reject) => {
                            createCategory.mutate(newSubPayload, {
                              onSuccess: resolve,
                              onError: reject,
                            });
                          }
                        );

                        // Get new subcategory ID from response
                        const newSubCategoryIdResp = newSubResp?.data?.id;
                        if (newSubCategoryIdResp) {
                          // Upload subcategory images using ID from response
                          await uploadImages(
                            newSubCategoryIdResp,
                            subIcon,
                            subBg
                          );
                        }
                      }
                    }
                  }

                  toast.success(resp.message);
                  navigate('/categories/listing');

                  // navigate('/categories/listing');
                } catch (error) {
                  console.error('Error updating category or images:', error);
                  toast.error(t('category.create.categoryUpdate_image_failed'));

                  navigate('/categories/listing');
                }
              },
              onError: (error) => {
                console.error('Error creating subcategory:', error);
                toast.error(t('category.create.failed_to_update_category'));
              },
            }
          );
        }
      } catch (error) {
        toast.error(t('category.create.failed_to_create_category'));
        console.error('Error creating category:', error);
      }
    },
    [
      form,
      navigate,
      subCategories,
      subCategoriesValidation,
      subCategoriesData,
      createCategory,
      editCategory,
      deleteCategory,
      uploadIcon,
      uploadImage,
      categoryId,
      deletedSubCategoryIds,
      t,
    ]
  );

  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">
        {t('category.create.heading')}
      </h1>
      <p className="text-foreground">{t('category.create.description')}</p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
        <Card className="w-full pt-4">
          {/* <CardHeader>
            <CardTitle>{t('category.create.heading')}</CardTitle>
            <CardDescription>
              {t('category.create.description')}
            </CardDescription>
          </CardHeader> */}
          <CardContent>
            <Form {...form}>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <TextInputField
                  name="name"
                  control={form.control}
                  label={t('category.create.form.name.label')}
                  placeholder={t('category.create.form.name.placeholder')}
                  required
                />

                <TextInputField
                  name="subtitle"
                  control={form.control}
                  label={t('category.create.form.subtitle.label')}
                  placeholder={t('category.create.form.subtitle.placeholder')}
                  required
                />

                <ColorPickerField
                  control={form.control}
                  name="headerBackgroundColor"
                  label={t('category.create.form.headerColor.label')}
                  required
                />

                <FileUploadField
                  control={form.control}
                  name="iconImageUrl"
                  label={t('category.create.form.icon.label')}
                  onDelete={
                    categoryId ? handleDeleteMainCategoryIcon : undefined
                  }
                />

                <RichTextField
                  name="description"
                  control={form.control}
                  label={t('category.create.form.description.label')}
                  className="h-32 overflow-y-auto"
                  placeholder={t(
                    'category.create.form.description.placeholder'
                  )}
                  required
                />

                <ColorPickerField
                  control={form.control}
                  name="contentBackgroundColor"
                  required
                  label={t('category.create.form.contentColor.label')}
                />

                <FileUploadField
                  control={form.control}
                  name="backgroundImageUrl"
                  required
                  label={t('category.create.form.backgroundImage.label')}
                />

                <FormSelectField
                  control={form.control}
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

                {/* Add Sub-Category Button */}
                {!categoryId && (
                  <>
                    <div className="pt-4 border-t space-y-2">
                      {/* <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      {/* Sub-categories: {subCategories.length}/3 (Optional -
                      Maximum: 3) */}
                      {/* {`${t('category.create.subCategory.subCategory_label')}: ${subCategories.length}/3 (${t('category.create.subCategory.max_3_sub_category_count')})`} */}
                      {/* </p> */}
                    </div>
                    <Button
                      onClick={addSubCategory}
                      variant="outline"
                      className="flex items-center gap-2 w-full"
                      type="button"
                      // disabled={subCategories.length >= 3}
                    >
                      <Plus className="size-5" />
                      {t('category.create.addSubCategory')}
                    </Button>
                  </>
                )}
                {/* {subCategories.length >= 3 && (
                    <p className="text-sm text-orange-600">
                      {t(`category.create.subCategory.max_3_sub_category`)}
                    </p>
                  )} */}
                {/* </div> */}

                {/* Render Sub-Categories */}
                {subCategories.map((subId) => (
                  <SubCategoryFormFields
                    key={subId}
                    id={subId}
                    initialValues={subCategoriesData[subId]}
                    onRemove={removeSubCategory}
                    onDataChange={handleSubCategoryDataChange}
                    onRegisterValidation={handleRegisterValidation}
                    onDeleteIcon={
                      subCategoriesData[subId]?.categoryId
                        ? () => handleDeleteSubCategoryIcon(subId)
                        : undefined
                    }
                    onRegisterReset={handleRegisterReset}
                  />
                ))}

                <div className="flex gap-5 flex-col md:flex-row justify-center pt-4 items-center border-t">
                  <Button
                    type="submit"
                    className="w-52"
                    disabled={
                      createCategory.isPending ||
                      editCategory.isPending ||
                      uploadIcon.isPending ||
                      uploadImage.isPending
                    }
                  >
                    {createCategory.isPending ||
                    editCategory.isPending ||
                    uploadIcon.isPending ||
                    uploadImage.isPending ? (
                      <Spinner className="size-5" />
                    ) : (
                      <SaveAll className="size-7" />
                    )}{' '}
                    {t('accountSetting.form.saveBtn')}
                  </Button>
                  <Button
                    variant="outline"
                    type="reset"
                    className="w-52 border-red-500"
                    onClick={() => {
                      if (categoryId && initialMainValues) {
                        // Reset to the original (server) values for edit mode
                        form.reset(initialMainValues);

                        // Restore sub-categories to original data and reset subforms accordingly
                        setSubCategoriesData(initialSubCategoriesData);
                        setSubCategories(
                          Object.keys(initialSubCategoriesData).map((k) =>
                            Number(k)
                          )
                        );
                        Object.entries(subCategoriesReset).forEach(
                          ([k, fn]) => {
                            const id = Number(k);
                            const init = initialSubCategoriesData[id];
                            if (fn) fn(init);
                          }
                        );
                      } else {
                        // Create mode: clear main form to empty defaults
                        form.reset();
                        // Also clear file fields explicitly for main category so previews are cleared
                        form.setValue('iconImageUrl', null);
                        form.setValue('backgroundImageUrl', null);
                        // Update parent-subcategory data to clear previews in the listing of previews
                        setSubCategoriesData((prev) => {
                          const next: Record<number, SubCategoryData> = {};
                          Object.keys(prev).forEach((k) => {
                            const key = Number(k);
                            // reset all text fields and file urls to empty/null
                            next[key] = {
                              name: '',
                              subtitle: '',
                              headerBackgroundColor: '',
                              iconImageUrl: null,
                              description: '',
                              contentBackgroundColor: '',
                              backgroundImageUrl: null,
                              categoryId: prev[key]?.categoryId,
                              parentId: prev[key]?.parentId,
                              isActive: 'false',
                            } as SubCategoryData;
                          });
                          return next;
                        });
                        // Reset all sub-forms (registered reset functions), which also clear subform file fields
                        Object.values(subCategoriesReset).forEach(
                          (fn) => fn && fn()
                        );
                      }

                      // Reset validation state so validations don't fire after resetting
                      setHasValidated(false);
                    }}
                  >
                    <RotateCcw /> {t('accountSetting.form.resetBtn')}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>

        <div className="space-y-4">
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

          {/* Render Sub-Category Previews */}
          {subCategories.map((subId) => {
            const subData = subCategoriesData[subId];
            if (!subData) return null;

            return (
              <CategoryPreview
                key={`preview-${subId}`}
                previewTitle={`${t('category.create.subCategory.heading')}: ${subData.name || 'Untitled'}`}
                {...{
                  categoryName: subData.name,
                  subtitle: subData.subtitle,
                  headerColor: subData.headerBackgroundColor,
                  categoryIcon: subData.iconImageUrl,
                  categoryDescription: subData.description,
                  contentColor: subData.contentBackgroundColor,
                  categoryImage: subData.backgroundImageUrl,
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CreateCategory;

import { Plus, RotateCcw, SaveAll } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  CategoryData,
  CategoryUploadPayload,
  EditCategoryUploadPayload,
} from '@/api/endpoints/categories';
import {
  useCreateCategory,
  useDeleteCategory,
  useGetCategory,
  useUpdateCityCategory,
  useUploadCityCategoryIcon,
  useUploadCityCategoryImage,
} from '@/api/queries';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { Spinner } from '@/components/ui/spinner';
import { useTypedTranslation } from '@/hooks';
import CategoryPreview from '@/pages/Categories/CategoryPreview';
import SubCategoryFormFields, {
  SubCategoryData,
} from '@/pages/Categories/SubCategoryFormFields';
import SubCategoryPreview from '@/pages/Categories/SubCategoryPreview';
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

function CategoryForm() {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();
  const createCategory = useCreateCategory();
  const editCategory = useUpdateCityCategory();
  const deleteCategory = useDeleteCategory();
  const { categoryId, cityId = '' } = useParams();
  const getCategoryQuery = useGetCategory(categoryId ?? '');
  const uploadIcon = useUploadCityCategoryIcon();
  const uploadImage = useUploadCityCategoryImage();
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
          headerBackgroundColor: child.headerBackgroundColor ?? '',
          iconImageUrl: addCacheBuster(child.iconUrl),
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

  const onSubmit = useCallback(
    async (data: CategoryUploadForm) => {
      // Enable onChange validation for all forms after first validation attempt
      setHasValidated(true);

      // Validate sub-categories if they exist
      const subCategoryValidations =
        subCategories.length > 0
          ? subCategories.map(async (subId) => {
              const validateFn = subCategoriesValidation[subId];
              if (validateFn) {
                const isValid = await validateFn();
                if (!isValid) {
                  console.error('SubCategory validation failed:', {
                    subCategoryId: subId,
                    subCategoryData: subCategoriesData[subId],
                  });
                }
                return isValid;
              }
              return true;
            })
          : [];

      const subCategoryResults = await Promise.all(subCategoryValidations);
      const allSubCategoriesValid =
        subCategoryResults.length === 0 ||
        subCategoryResults.every((result) => result === true);

      if (!allSubCategoriesValid) {
        const failedSubCategories = subCategoryResults
          .map((result, index) => (!result ? subCategories[index] : null))
          .filter((id) => id !== null);
        console.error('SubCategory validation failed for:', {
          failedSubCategoryIds: failedSubCategories,
          subCategoryResults: subCategoryResults,
        });
        toast.error(t('category.create.subCategory.fix_sub_category'));
        return;
      }

      // Helper: Extract file from File object
      const extractFile = async (raw: string | File | null) => {
        if (!raw || typeof raw === 'string') return null;
        return raw;
      };

      // Helper: Upload images for a category
      const uploadImages = async (
        catId: string,
        iconRaw: File | string | null | undefined,
        bgRaw: File | string | null | undefined
      ) => {
        const iconFile =
          iconRaw instanceof File ? await extractFile(iconRaw) : null;
        const bgFile = bgRaw instanceof File ? await extractFile(bgRaw) : null;

        const uploads = [];

        if (iconFile) {
          uploads.push(
            new Promise((resolve, reject) => {
              uploadIcon.mutate(
                { cityId, categoryId: catId, file: iconFile },
                { onSuccess: resolve, onError: reject }
              );
            })
          );
        }

        if (bgFile) {
          uploads.push(
            new Promise((resolve, reject) => {
              uploadImage.mutate(
                { cityId, categoryId: catId, file: bgFile },
                { onSuccess: resolve, onError: reject }
              );
            })
          );
        }

        if (uploads.length > 0) await Promise.all(uploads);
      };

      // Helper: Create subcategory
      const createSubCategory = async (
        subData: SubCategoryData,
        parentId: string
      ) => {
        const { iconImageUrl, backgroundImageUrl, ...restSubData } = subData;

        const payload = {
          name: restSubData.name,
          headerBackgroundColor: restSubData.headerBackgroundColor,
          parentId,
          isActive: true,
        } as CategoryUploadPayload;

        return new Promise<string>((resolve, reject) => {
          createCategory.mutate(payload, {
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

      // Helper: Update subcategory
      const updateSubCategory = async (subData: SubCategoryData) => {
        const {
          iconImageUrl: subIconImageUrl,
          backgroundImageUrl: subBackgroundImageUrl,
          ...restSubData
        } = subData;

        const payload = {
          name: restSubData.name,
          headerBackgroundColor: restSubData.headerBackgroundColor,
          parentId: categoryId,
          isActive: subData.isActive === 'true',
        } as EditCategoryUploadPayload;

        return new Promise<void>((resolve, reject) => {
          editCategory.mutate(
            {
              cityId,
              categoryId: subData.categoryId as string,
              payload,
            },
            {
              onSuccess: async (subResp) => {
                if (!subResp.success) {
                  toast.error(subResp.error || 'Failed to update sub-category');
                  reject(
                    new Error(subResp.error || 'Failed to update sub-category')
                  );
                  return;
                }

                try {
                  await uploadImages(
                    subData.categoryId as string,
                    subIconImageUrl,
                    subBackgroundImageUrl
                  );
                  resolve();
                } catch (error) {
                  console.error('Error uploading subcategory images:', error);
                  reject(error);
                }
              },
              onError: (error) => {
                console.error('Error updating subcategory:', error);
                reject(error);
              },
            }
          );
        });
      };

      // Helper: Delete subcategory
      const deleteSubCategory = async (id: string) => {
        return new Promise<void>((resolve, reject) => {
          deleteCategory.mutate(id, {
            onSuccess: (delResp) => {
              if (delResp.success) {
                resolve();
              } else {
                reject(new Error('Failed to delete subcategory'));
              }
            },
            onError: reject,
          });
        });
      };

      try {
        const { iconImageUrl, backgroundImageUrl, ...restData } = data;

        // CREATE MODE
        if (!categoryId) {
          const payload = {
            ...restData,
            isActive: data.isActive === 'true',
            cities: [{ cityId: '22a7b284-76aa-43a7-a3ec-797f0c045182' }],
          };

          createCategory.mutate(payload, {
            onSuccess: async (resp) => {
              if (!resp.success) {
                toast.error(resp.error || 'Failed to create category');
                return;
              }

              const newCategoryId = resp.data?.id;
              if (!newCategoryId) {
                toast.error('No category ID returned');
                return;
              }

              try {
                await uploadImages(
                  newCategoryId,
                  iconImageUrl,
                  backgroundImageUrl
                );

                if (subCategories.length > 0) {
                  toast.info('Creating sub-categories...');
                  for (const subId of subCategories) {
                    const subData = subCategoriesData[subId];
                    if (subData) {
                      try {
                        await createSubCategory(subData, newCategoryId);
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

                navigate('/categories/city');
              } catch (error) {
                console.error('Error in post-creation process:', error);
                toast.error(t('category.create.categoryCreate_image_failed'));
                navigate('/categories/city');
              }
            },
            onError: (error) => {
              toast.error('Failed to create category');
              console.error('Error creating category:', error);
            },
          });
        }
        // UPDATE MODE
        else {
          if (!cityId) {
            toast.error('City ID is missing');
            return;
          }

          const payload = {
            ...restData,
            isActive: data.isActive === 'true',
          };

          editCategory.mutate(
            { cityId, categoryId, payload },
            {
              onSuccess: async (resp) => {
                if (!resp.success) {
                  toast.error(resp.error || 'Failed to update category');
                  return;
                }

                try {
                  await uploadImages(
                    categoryId,
                    iconImageUrl,
                    backgroundImageUrl
                  );

                  if (subCategories.length > 0) {
                    toast.info('Updating sub-categories...');
                    for (const subId of subCategories) {
                      const subData = subCategoriesData[subId];
                      if (subData) {
                        try {
                          if (subData.categoryId) {
                            await updateSubCategory(subData);
                          } else {
                            await createSubCategory(subData, categoryId);
                          }
                        } catch (error) {
                          console.error(
                            `Error processing subcategory ${subId}:`,
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
                  }

                  if (deletedSubCategoryIds.length > 0) {
                    for (const deletedId of deletedSubCategoryIds) {
                      try {
                        await deleteSubCategory(deletedId);
                      } catch (error) {
                        console.error(
                          `Error deleting subcategory ${deletedId}:`,
                          error
                        );
                      }
                    }
                  }

                  toast.success('Category updated successfully');
                  navigate('/categories/city');
                } catch (error) {
                  console.error('Error in post-update process:', error);
                  toast.error(
                    t('category.create.categoryUpdate_image_failed') ||
                      'Category updated but image upload failed'
                  );
                  navigate('/categories/city');
                }
              },
              onError: (error) => {
                toast.error('Failed to update category');
                console.error('Error updating category:', error);
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
      cityId,
    ]
  );

  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">
        {t('category.create.heading')}
      </h1>
      <p className="text-foreground">{t('category.create.description')}</p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('category.create.heading')}</CardTitle>
            <CardDescription>
              {t('category.create.description')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
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
                  aria-label={t('category.create.addSubCategory')}
                  // disabled={subCategories.length >= 3}
                >
                  <Plus className="size-5" />
                  {t('category.create.addSubCategory')}
                </Button>
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
                              headerBackgroundColor: '',
                              iconImageUrl: null,
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
              <SubCategoryPreview
                key={`preview-${subId}`}
                previewTitle={`${t('category.create.subCategory.heading')}: ${subData.name || 'Untitled'}`}
                {...{
                  categoryName: subData.name,
                  headerColor: subData.headerBackgroundColor,
                  categoryIcon: subData.iconImageUrl,
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

export default CategoryForm;

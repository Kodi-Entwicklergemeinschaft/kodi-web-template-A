import { RotateCcw, SaveAll } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  useCreateCategory,
  useDeleteCategory,
  useDeleteCategoryIcon,
  useDeleteCategoryImage,
  useEditCategory,
  useUploadCategoryIcon,
  useUploadCategoryImage,
} from '@/api/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import {
  categoryUploadSchema1,
  CreateCategoryForm,
} from '@/schema/categoryUpload';
import {
  ColorPickerField,
  FileUploadField,
  FormSelectField,
  RichTextField,
  TextInputField,
} from '@/shared/FormField';

import CategoriesFormPreview from './CategoriesFormPreview';
import NewSubCategories from './NewSubCategories';
import SubCategoriesFormPreview from './SubCategoriesFormPreview';

type NewFormProps = {
  initialCategoriesData?: CreateCategoryForm;
  showAddCategory?: boolean;
  cityId?: string;
};

const DEFAULT_CATEGORY = {
  name: '',
  subtitle: '',
  description: '',
  headerBackgroundColor: '',
  contentBackgroundColor: '',
  iconImageUrl: null,
  backgroundImageUrl: null,
  parentId: null,
  isActive: 'false',
} as Omit<CreateCategoryForm, 'children'>;

function NewForm({
  initialCategoriesData,
  showAddCategory = true,
}: NewFormProps) {
  const { categoryId = '' } = useParams();
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // ---------- ALL APIS -----------
  const updateCategoryMutate = useEditCategory();
  const createCategoryMutate = useCreateCategory();
  const updateCategoryBgImage = useUploadCategoryImage();
  const updateCategoryIcon = useUploadCategoryIcon();

  const deleteCategory = useDeleteCategory();
  const deleteCategoryIcon = useDeleteCategoryIcon();
  const deleteCategoryImage = useDeleteCategoryImage();
  // -----------

  const form = useForm<CreateCategoryForm>({
    resolver: zodResolver(categoryUploadSchema1),
    mode: 'onSubmit',
    values: initialCategoriesData,
    defaultValues: {
      ...DEFAULT_CATEGORY,
      children: undefined,
    },
  });
  // const formError = form.formState.errors;
  // console.log('🚀 ~ NewForm ~ formError:', formError);

  const updateImageORIcon = useCallback(
    async (
      id: string,
      currentData: File | null | string,
      oldData: undefined | File | null | string,
      deleteFn: typeof deleteCategoryImage.mutateAsync,
      updateFn: typeof updateCategoryBgImage.mutateAsync
    ) => {
      // Guard: ID is required
      if (!id) return;

      // CASE 1: Image removed - delete if old image existed
      if (currentData == null && typeof oldData === 'string') {
        await deleteFn({ id });
        return;
      }

      // CASE 2: New file uploaded
      if (currentData instanceof File) {
        // Delete old image before uploading new one
        if (typeof oldData === 'string') {
          await deleteFn({ id });
        }
        await updateFn({ id, file: currentData });
        return;
      }

      // CASE 3: No change (same URL or no modification) - do nothing
    },
    [deleteCategoryImage, updateCategoryBgImage]
  );
  const onSubmit = async (formValues: CreateCategoryForm) => {
    try {
      // STEP 1: START LOADER
      setIsFormSubmitting(true);
      if (categoryId) {
        const resp = await updateCategoryMutate.mutateAsync({
          categoryId,
          payload: { ...formValues, isActive: formValues.isActive === 'true' },
        });

        // Update MAIN icon/image
        if (resp?.success) {
          await updateImageORIcon(
            resp.data.id, // correct id
            formValues.backgroundImageUrl,
            initialCategoriesData?.backgroundImageUrl,
            deleteCategoryImage.mutateAsync,
            updateCategoryBgImage.mutateAsync
          );

          await updateImageORIcon(
            resp.data.id,
            formValues.iconImageUrl,
            initialCategoriesData?.iconImageUrl,
            deleteCategoryIcon.mutateAsync,
            updateCategoryIcon.mutateAsync
          );
        }

        // STEP 4: SUB CATEGORIES
        if (resp.success) {
          // STEP 4.1: DELETE SUB CATEGORIES IF IT IS FOUND IN INITIAL DATA BUT NOT IN FORM DATA
          const deletedCategoriesId = initialCategoriesData?.children
            ?.filter((c) => {
              return !formValues?.children?.find((child) => child.id === c.id);
            })
            .map((c) => String(c.id));

          if (deletedCategoriesId?.length) {
            await Promise.all(
              deletedCategoriesId.map((id) => deleteCategory.mutateAsync(id))
            );
          }

          // STEP 4.2: CREATE SUB CATEGORIES IF NOT FOUND IN INITIAL DATA BUT FOUND IN FORM DATA
          const newSubCategoriesData = formValues?.children
            ?.filter((child) => {
              return !initialCategoriesData?.children?.find(
                (c) => c.id === child.id
              );
            })
            .map((child) => ({
              ...child,
              parentId: resp.data.id,
            }));

          if (newSubCategoriesData?.length) {
            const mappedData = newSubCategoriesData.map((c) =>
              createCategoryMutate.mutateAsync({
                ...c,
                isActive: c.isActive === 'true',
              })
            );

            await Promise.all(mappedData);
          }

          // STEP 4.3: UPDATE SUB CATEGORIES
          if (formValues.children && formValues.children.length > 0) {
            for (const child of formValues.children) {
              if (child.id) {
                // Find the original child data from initial data
                const originalChild = initialCategoriesData?.children?.find(
                  (c) => c.id === child.id
                );

                // STEP 4.1: UPDATE SUB CATEGORY (must use mutateAsync)
                const res = await updateCategoryMutate.mutateAsync({
                  categoryId: child.id,
                  payload: {
                    ...child,
                    isActive: child.isActive === 'true',
                  },
                });

                if (res.success && res.data?.id) {
                  // IMPORTANT: Get updated child ID safely
                  const childId = res.data.id;

                  // STEP 4.2: UPDATE ICON AND IMAGE
                  await updateImageORIcon(
                    childId,
                    child.iconImageUrl,
                    originalChild?.iconImageUrl, // Use ORIGINAL data
                    deleteCategoryIcon.mutateAsync,
                    updateCategoryIcon.mutateAsync
                  );

                  await updateImageORIcon(
                    childId,
                    child.backgroundImageUrl,
                    originalChild?.backgroundImageUrl, // Use ORIGINAL data
                    deleteCategoryImage.mutateAsync,
                    updateCategoryBgImage.mutateAsync
                  );
                }
              }
            }
          }

          toast.success(resp.message);
        }
      } else {
        const payload = {
          ...formValues,
          isActive: formValues.isActive === 'true',
          cities: [
            {
              cityId: '22a7b284-76aa-43a7-a3ec-797f0c045182',
            },
          ],
        };
        const resp = await createCategoryMutate.mutateAsync(payload);

        if (resp.success) {
          await updateImageORIcon(
            resp.data.id,
            formValues.backgroundImageUrl,
            initialCategoriesData?.backgroundImageUrl,
            deleteCategoryImage.mutateAsync,
            updateCategoryBgImage.mutateAsync
          );
          await updateImageORIcon(
            resp.data.id,
            formValues.iconImageUrl,
            initialCategoriesData?.iconImageUrl,
            deleteCategoryIcon.mutateAsync,
            updateCategoryIcon.mutateAsync
          );

          // STEP 4: CREATE SUB CATEGORIES
          if (formValues.children && formValues.children.length > 0) {
            for (const child of formValues.children) {
              const childPayload = {
                ...child,
                isActive: child.isActive === 'true',
                parentId: resp.data.id, // NEW parent ID
              };

              // STEP 4.1: CREATE SUB CATEGORY
              const res = await createCategoryMutate.mutateAsync(childPayload);

              // STEP 4.2: UPLOAD ICON AND IMAGE FOR NEWLY CREATED SUB CATEGORY
              if (res.success && res.data?.id) {
                await updateImageORIcon(
                  res.data.id,
                  child.iconImageUrl,
                  undefined, // no old data for new category
                  deleteCategoryIcon.mutateAsync,
                  updateCategoryIcon.mutateAsync
                );
                await updateImageORIcon(
                  res.data.id,
                  child.backgroundImageUrl,
                  undefined, // no old data for new category
                  deleteCategoryImage.mutateAsync,
                  updateCategoryBgImage.mutateAsync
                );
              }
            }
          }

          toast.success(resp.message);
        }
      }
    } catch (error) {
      console.error('🚀 ~ onSubmit ~ error:', error);
    } finally {
      setIsFormSubmitting(false);
      navigate('/categories/listing');
    }
  };

  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">
        {categoryId
          ? t('category.update.heading')
          : t('category.create.heading')}
      </h1>
      <p className="text-foreground">
        {categoryId
          ? t('category.update.description')
          : t('category.create.description')}
      </p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
        <Card className="w-full">
          {/* {!categoryId && (
            <CardHeader>
              <CardTitle>{t('category.create.heading')}</CardTitle>
              <CardDescription>
                {t('category.create.description')}
              </CardDescription>
            </CardHeader>
          )} */}
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4 mt-3"
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

                {/* Add Sub-Category */}
                <NewSubCategories
                  categoriesForm={form}
                  showAddCategory={showAddCategory}
                  defaultCategory={DEFAULT_CATEGORY}
                  isEdit={!!categoryId}
                />

                <div className="flex gap-5 flex-col md:flex-row justify-center pt-4 items-center border-t">
                  <Button
                    type="submit"
                    className="w-52"
                    loading={isFormSubmitting}
                  >
                    <SaveAll className="size-7" />

                    {t('accountSetting.form.saveBtn')}
                  </Button>
                  <Button
                    variant="outline"
                    type="reset"
                    className="w-52 border-red-500"
                    onClick={() => {
                      form.reset();
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
          <CategoriesFormPreview categoriesForm={form} />
          <SubCategoriesFormPreview categoriesForm={form} />
        </div>
      </div>
    </div>
  );
}

export default NewForm;

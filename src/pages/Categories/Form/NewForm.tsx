import { RotateCcw, SaveAll } from 'lucide-react';
import { useCallback, useState } from 'react';

import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import {
  useCreateCategory,
  useDeleteCategory,
  useDeleteCategoryIcon,
  useDeleteCategoryImage,
  useDeleteCityCategoryIcon,
  useDeleteCityCategoryImage,
  useUpdateCityCategory,
  useUploadCategoryIcon,
  useUploadCategoryImage,
  useUploadCityCategoryIcon,
  useUploadCityCategoryImage,
} from '@/api/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import {
  EditCityCategoryForm,
  editCityCategorySchema,
} from '@/schema/categoryUpload';
import {
  ColorPickerField,
  FileUploadField,
  FormSelectField,
  TextAreaFormField,
  TextInputField,
} from '@/shared/FormField';

import CategoriesFormPreview from './CategoriesFormPreview';
import NewSubCategories from './NewSubCategories';
import SubCategoriesFormPreview from './SubCategoriesFormPreview';

type NewFormProps = {
  initialCategoriesData?: EditCityCategoryForm;
  showAddSubCategory?: boolean;
  showDeleteSubCategory?: boolean;
  cityId?: string;
  categoryId?: string;
  editMode?: boolean;
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
} as Omit<EditCityCategoryForm, 'children'>;

function NewForm({
  initialCategoriesData,
  showAddSubCategory = true,
  cityId,
  categoryId,
  editMode,
}: NewFormProps) {
  const { t } = useTypedTranslation();
  const navigate = useNavigate();

  const [isFormSubmitting, setIsFormSubmitting] = useState(false);

  // ---------- ALL APIS -----------
  const updateCityCategoryMutate = useUpdateCityCategory();
  const updateCityCategoryBgImage = useUploadCityCategoryImage();
  const updateCityCategoryIcon = useUploadCityCategoryIcon();

  const deleteCityCategoryIcon = useDeleteCityCategoryIcon();
  const deleteCityCategoryImage = useDeleteCityCategoryImage();

  //Create categories
  const createCategoryMutate = useCreateCategory();
  const deleteCategoryIcon = useDeleteCategoryIcon();
  const deleteCategoryImage = useDeleteCategoryImage();
  const updateCategoryBgImage = useUploadCategoryImage();
  const updateCategoryIcon = useUploadCategoryIcon();
  //Delete categories
  const deleteCategoryById = useDeleteCategory();

  // -----------

  const form = useForm<EditCityCategoryForm>({
    resolver: zodResolver(editCityCategorySchema),
    mode: 'onSubmit',
    values: initialCategoriesData,
    defaultValues: {
      ...DEFAULT_CATEGORY,
      children: undefined,
    },
  });

  const updateImageORIcon = useCallback(
    async (
      categoryId: string,
      currentData: File | null | string,
      oldData: undefined | File | null | string,
      deleteFn: typeof deleteCityCategoryImage.mutateAsync,
      updateFn: typeof updateCityCategoryBgImage.mutateAsync
    ) => {
      if (
        cityId &&
        categoryId &&
        (currentData instanceof File || currentData === null)
      ) {
        if (oldData) {
          await deleteFn({
            cityId,
            categoryId,
          });
        }
        if (currentData instanceof File)
          await updateFn({ categoryId, cityId, file: currentData });
      }
    },
    [cityId, deleteCityCategoryImage, updateCityCategoryBgImage]
  );

  const updateImageORIconForCreate = useCallback(
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

  /**
   * Create sub categories based on form values children.
   * @param {EditCityCategoryForm['children']} formValuesChildren - Form values children.
   * @param {string} parentId - Parent ID.
   * @returns  - Promise that resolves after all sub categories are created.
   */
  const createSubCategories = async (
    formValuesChildren: EditCityCategoryForm['children'],
    parentId: string
  ) => {
    // STEP 1: GUARD CLAUSE
    if (!formValuesChildren?.length) return;
    // STEP 2: LOOP THROUGH EACH CHILDREN
    const promises = formValuesChildren.map(async (child) => {
      // STEP 3: PREPARE PAYLOAD
      const childPayload = {
        ...child,
        cities: [
          {
            cityId: cityId || '',
          },
        ],
        isActive: child.isActive === 'true',
        parentId: parentId, // NEW parent ID
      };

      // STEP 4: CREATE SUB CATEGORY
      const res = await createCategoryMutate.mutateAsync(childPayload);

      // STEP 5: UPLOAD ICON AND IMAGE FOR NEWLY CREATED SUB CATEGORY
      if (res.success && res.data?.id) {
        if (child.backgroundImageUrl)
          await updateImageORIconForCreate(
            res.data.id,
            child.backgroundImageUrl,
            undefined, // no old data for new category
            deleteCategoryImage.mutateAsync,
            updateCategoryBgImage.mutateAsync
          );
      }
    });

    await Promise.all(promises);
  };

  const createCategory = async (formValues: EditCityCategoryForm) => {
    // STEP 1: PREPARE PAYLOAD
    const payload = {
      ...formValues,
      isActive: formValues.isActive === 'true',
      cities: [
        {
          cityId: cityId || '',
        },
      ],
    };
    // STEP 2: CREATE CATEGORY
    const resp = await createCategoryMutate.mutateAsync(payload);

    if (resp.success) {
      // STEP 3: UPLOAD ICON AND IMAGE

      await updateImageORIconForCreate(
        resp.data.id,
        formValues.backgroundImageUrl,
        initialCategoriesData?.backgroundImageUrl,
        deleteCategoryImage.mutateAsync,
        updateCategoryBgImage.mutateAsync
      );
      await updateImageORIconForCreate(
        resp.data.id,
        formValues.iconImageUrl,
        initialCategoriesData?.iconImageUrl,
        deleteCategoryIcon.mutateAsync,
        updateCategoryIcon.mutateAsync
      );

      // STEP 4: CREATE SUB CATEGORIES
      await createSubCategories(formValues.children, resp.data.id);

      toast.success(resp.message);
    }
    toast.success('Category created successfully');
  };
  const deleteExistingSubCategories = async (
    formValues: EditCityCategoryForm
  ) => {
    const existingChildrenIds =
      initialCategoriesData?.children
        ?.filter((child) => child.id)
        .map((child) => child.id) || [];
    const updatedChildrenIds =
      formValues.children
        ?.filter((child) => child.id)
        .map((child) => child.id) || [];
    const childrenIdsToDelete = existingChildrenIds.filter(
      (id) => !updatedChildrenIds.includes(id)
    );
    // deleteCategoryById.mutate({ ids: childrenIdsToDelete });
    childrenIdsToDelete?.forEach((id) => {
      if (id) {
        deleteCategoryById.mutate(id);
      }
    });
  };

  const editCategory = async (formValues: EditCityCategoryForm) => {
    // STEP 1: GUARD CLAUSE
    if (!cityId || !categoryId) return;
    // STEP 2: UPDATE ICON AND IMAGE
    const resp = await updateCityCategoryMutate.mutateAsync({
      categoryId: categoryId || '',
      cityId: cityId || '',
      payload: { ...formValues, isActive: formValues.isActive === 'true' },
    });
    if (resp?.success) {
      await updateImageORIcon(
        resp.data.id,
        formValues.backgroundImageUrl,
        initialCategoriesData?.backgroundImageUrl,
        deleteCityCategoryImage.mutateAsync,
        updateCityCategoryBgImage.mutateAsync
      );
      await updateImageORIcon(
        resp.data.id,
        formValues.iconImageUrl,
        initialCategoriesData?.iconImageUrl,
        deleteCityCategoryIcon.mutateAsync,
        updateCityCategoryIcon.mutateAsync
      );
    }
    // STEP 3: UPDATE MAIN CATEGORY

    if (resp.success) {
      // STEP 4: DELETE EXISTING SUB CATEGORIES THAT ARE REMOVED IN EDIT MODE
      await deleteExistingSubCategories(formValues);
      // STEP 5: UPDATE SUB CATEGORIES
      formValues.children?.forEach(async (child) => {
        if (child.id) {
          const res = await updateCityCategoryMutate.mutateAsync({
            categoryId: child.id,
            cityId: cityId || '',
            payload: { ...child, isActive: child.isActive === 'true' },
          });
          // STEP 4.1: UPDATE ICON AND IMAGE
          if (res.success && res.data?.id) {
            if (child.backgroundImageUrl)
              await updateImageORIcon(
                res.data?.id,
                child.backgroundImageUrl,
                initialCategoriesData?.backgroundImageUrl,
                deleteCityCategoryImage.mutateAsync,
                updateCityCategoryBgImage.mutateAsync
              );
          }
        } else {
          // CREATE NEW SUB CATEGORY
          await createSubCategories([child], resp.data.id);
        }
      });
      toast.success(resp.message);
    }
  };

  const onSubmit = async (formValues: EditCityCategoryForm) => {
    try {
      // STEP 1: START LOADER
      setIsFormSubmitting(true);

      if (cityId && categoryId && editMode) {
        // STEP 2 : EDIT CATEGORY LOGIC HERE
        await editCategory(formValues);
      } else {
        // STEP 3 : CREATE CATEGORY LOGIC HERE
        await createCategory(formValues);
      }
    } catch (error) {
      console.error('🚀 ~ onSubmit ~ error:', error);
    } finally {
      navigate('/categories/city');
      setIsFormSubmitting(false);
    }
  };

  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">
        {!editMode
          ? t('category.create.heading')
          : t('category.create.editHeading')}
      </h1>
      <p className="text-foreground">
        {!editMode
          ? t('category.create.description')
          : t('category.create.editDescription')}
      </p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
        <Card className="w-full pt-4">
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <TextInputField
                  name="displayOrder"
                  type="number"
                  control={form.control}
                  label={t('category.create.form.displayOrder.label')}
                  placeholder={t(
                    'category.create.form.displayOrder.placeholder'
                  )}
                />
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
                  required
                />

                <TextAreaFormField
                  name="description"
                  control={form.control}
                  label={t('category.create.form.description.label')}
                  className="h-32 overflow-y-auto"
                  placeholder={t(
                    'category.create.form.description.placeholder'
                  )}
                  required
                />
                {/* <RichTextField
                  name="description"
                  control={form.control}
                  label={t('category.create.form.description.label')}
                  className="h-32 overflow-y-auto"
                  placeholder={t(
                    'category.create.form.description.placeholder'
                  )}
                  required
                /> */}

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
                  showAddSubCategory={showAddSubCategory}
                  defaultCategory={DEFAULT_CATEGORY}
                  editMode={editMode}
                  showDeleteSubCategory={showAddSubCategory}
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
          <CategoriesFormPreview
            previewTitle={t('category.create.preview.cityHeading')}
            description={t('category.create.preview.cityDescription')}
            categoriesForm={form}
          />
          <SubCategoriesFormPreview categoriesForm={form} />
        </div>
      </div>
    </div>
  );
}

export default NewForm;

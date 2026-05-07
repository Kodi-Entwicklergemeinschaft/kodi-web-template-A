import { RotateCcw, SaveAll } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatISO } from 'date-fns';
import { toast } from 'sonner';

import { CreateListingPayload, ListData } from '@/api/endpoints';
import {
  useCreateListMutate,
  useDeleteHeroImage,
  useDeleteMediaImages,
  useGetAllTags,
  useGetCityCategories,
  useGetCityList,
  useUpdateListingMutate,
  useUploadHeroImageMutate,
  useUploadMediaMutate,
} from '@/api/queries';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import ROUTES from '@/route/routesConstant';
import { listingUploadSchema, ListUploadForm } from '@/schema/listingUpload';
import {
  FileUploadField,
  RichTextField,
  TextInputField,
} from '@/shared/FormField';
import { DateTimePickerField } from '@/shared/FormField/DatePicker';
import { DropdownField } from '@/shared/FormField/DropDownField';
import { AddressAutocompleteField } from '@/shared/FormField/LocationPicker';
import { MultiFileUploadField } from '@/shared/FormField/MultiFileUpload';
import { SingleDropdownField } from '@/shared/FormField/SingleDropDownField';

import ListingUploadPreview from './ListingUploadPreview';

type ListFormUploadProps = Partial<{
  listingId: string;
  selectedListingData: ListUploadForm;
  listData: ListData;
}>;

function ListFormUpload({
  listingId,
  selectedListingData,
  listData,
}: ListFormUploadProps) {
  const updateListing = useUpdateListingMutate();
  const createListing = useCreateListMutate();
  const uploadHeroImageMutate = useUploadHeroImageMutate();
  const uploadMediaMutate = useUploadMediaMutate();
  const deleteHeroImage = useDeleteHeroImage();
  const deleteListMedia = useDeleteMediaImages();
  const { t } = useTypedTranslation();
  const pageHeading = listingId
    ? t('listing.edit.heading')
    : t('listing.upload.heading');
  const pageDescription = listingId
    ? t('listing.edit.description')
    : t('listing.upload.description');
  const navigate = useNavigate();
  const { data: allTagsData } = useGetAllTags({
    page: 1,
    pageSize: 100,
  });

  const fetchedTagsData = useMemo(() => {
    if (allTagsData?.success && allTagsData?.data?.items?.length) {
      return allTagsData.data.items.map((tag) => ({
        label: tag.label,
        value: tag.id,
      }));
    } else {
      return [];
    }
  }, [allTagsData]);

  const { data: cityListData } = useGetCityList();
  const fetchedCityData = useMemo(() => {
    if (cityListData?.success && cityListData?.data?.items?.length) {
      return cityListData.data.items.map((city) => ({
        label: city.name,
        value: city.id,
      }));
    } else {
      return [];
    }
  }, [cityListData]);

  const form = useForm<ListUploadForm>({
    resolver: zodResolver(listingUploadSchema),
    values: selectedListingData,
    defaultValues: {
      title: '',
      website: '',
      summary: '',
      content: '',
      contactEmail: '',
      contactPhone: '',
      cities: [],
      categories: [],
      heroImageUrl: '',
      subCategories: [],
      media: [],
      tags: [],
    },
  });

  const cities = useWatch({ control: form.control, name: 'cities' });
  const { data: categoriesApiData } = useGetCityCategories({
    cityId: cities[0],
    showAll: true,
    sortBy: 'createdAt',
    sortDirection: 'desc',
    page: 1,
    pageSize: 100,
  });
  const fetchedCategoryData = useMemo(() => {
    if (categoriesApiData?.success && categoriesApiData?.data?.items?.length) {
      return categoriesApiData?.data?.items?.map((cat) => ({
        label: cat.name,
        value: cat.id,
      }));
    } else {
      return [];
    }
  }, [categoriesApiData]);
  const selectedCategories = form.getValues('categories');
  const fetchedSubCategoryData = useMemo(() => {
    if (selectedCategories[0] != selectedListingData?.categories[0])
      form.setValue('subCategories', []);
    const category = selectedCategories.toString();
    if (
      categoriesApiData?.success &&
      categoriesApiData?.data?.items?.length &&
      category.length > 0
    ) {
      const subCategories = categoriesApiData?.data.items?.find(
        (cat) => cat.id === category
      )?.children;
      return subCategories?.map((cat) => ({
        label: cat.name,
        value: cat.id,
      }));
    } else {
      return [];
    }
  }, [
    selectedCategories,
    selectedListingData?.categories,
    form,
    categoriesApiData,
  ]);

  const title = useWatch({ control: form.control, name: 'title' });
  const websiteUrl = useWatch({ control: form.control, name: 'website' });
  const [loading, setLoading] = useState(false);
  const summary = useWatch({ control: form.control, name: 'summary' });
  const description = useWatch({ control: form.control, name: 'content' });
  const subCategories = useWatch({
    control: form.control,
    name: 'subCategories',
  });
  const address = useWatch({ control: form.control, name: 'address' });
  const tags = useWatch({ control: form.control, name: 'tags' });

  const startDate = useWatch({ control: form.control, name: 'eventStart' });
  const endDate = useWatch({ control: form.control, name: 'eventEnd' });
  const contactEmail = useWatch({
    control: form.control,
    name: 'contactEmail',
  });
  const contactPhone = useWatch({
    control: form.control,
    name: 'contactPhone',
  });

  const categories = useWatch({
    control: form.control,
    name: 'categories',
  });
  const heroImageUrl = useWatch({
    control: form.control,
    name: 'heroImageUrl',
  });

  const onSubmit = (formValues: ListUploadForm) => {
    setLoading(true);
    const categories = [
      ...formValues.categories.map((cat) => ({
        categoryId: cat,
      })),
      ...formValues.subCategories.map((subCat) => ({
        categoryId: subCat,
      })),
    ];
    const cities = formValues.cities.map((city) => ({ cityId: city }));
    const tags = formValues.tags.map((tag) => ({ tagId: tag }));
    const createData: CreateListingPayload & { subCategories?: string[] } = {
      ...formValues,
      visibility: 'PUBLIC',
      sourceType: 'MANUAL',
      contactPhone: formValues.contactPhone || null,
      categories,
      cities,
      tags,
      eventEnd: formatISO(formValues.eventEnd),
      eventStart: formatISO(formValues.eventStart),
      geoLat: Number(formValues.geoLat),
      geoLng: Number(formValues.geoLng),
    };
    delete createData?.subCategories;
    if (listingId) {
      updateListing.mutate(
        {
          listingId,
          payload: createData,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              const oldHeroImage = listData?.heroImageUrl;
              if (oldHeroImage && !formValues.heroImageUrl) {
                deleteHeroImage.mutate({
                  id: listingId,
                });
                // Delete old hero image
              } else if (
                formValues.heroImageUrl &&
                formValues.heroImageUrl instanceof File
              ) {
                if (oldHeroImage && typeof oldHeroImage === 'string') {
                  deleteHeroImage.mutate({
                    id: listingId,
                  });
                  // Delete old hero image
                }
                handleUploadHeroImage(formValues.heroImageUrl, listingId);
              }
              if (listData) {
                // Compare form-values with metadata.media
                const deletedMedia = listData.metadata.media
                  .filter(
                    (m) => !(formValues?.media as string[]).includes(m.url)
                  )
                  .map((media) => ({ id: media.id }));
                // Delete old media
                if (deletedMedia.length > 0)
                  deleteListMedia.mutate({
                    id: listingId,
                    ids: deletedMedia,
                  });
                if (
                  formValues.media &&
                  formValues.media.some(
                    (formMedia) => formMedia instanceof File
                  )
                ) {
                  const uploadMedias = formValues.media.filter(
                    (formMedia) => formMedia instanceof File
                  );
                  if (uploadMedias && uploadMedias.length > 0)
                    handleUploadMedia(uploadMedias, listingId);
                }
              }
              toast.success(data.message || 'Successfully updated listing');
              navigate(ROUTES.Listings + '/' + ROUTES.Lists);
            }
          },
        }
      );
    } else {
      handleCreateListing(createData, formValues);
    }
  };

  const handleUploadHeroImage = useCallback(
    async (heroImage: File, listingId: string) => {
      uploadHeroImageMutate.mutate(
        {
          listingId,
          heroImage,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              toast.success(data.message);
            }
          },
        }
      );
    },
    [uploadHeroImageMutate]
  );

  const handleUploadMedia = useCallback(
    async (mediaFiles: File[], listingId: string) => {
      uploadMediaMutate.mutate(
        {
          listingId,
          mediaFiles,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              toast.success(data.message);
            }
          },
        }
      );
    },
    [uploadMediaMutate]
  );

  const handleCreateListing = (
    createData: CreateListingPayload,
    formValues: ListUploadForm
  ) => {
    createListing.mutate(createData, {
      onSuccess: (data) => {
        if (data.success) {
          if (
            formValues.heroImageUrl &&
            formValues.heroImageUrl instanceof File
          ) {
            handleUploadHeroImage(formValues.heroImageUrl, data.data.id);
          }
          if (
            !!formValues.media?.length &&
            formValues.media.every((formMedia) => formMedia instanceof File)
          ) {
            handleUploadMedia(formValues.media, data.data.id);
          }
          toast.success(data.message || 'Successfully created listing');
          navigate(ROUTES.Listings + '/' + ROUTES.Lists);
        }
      },
    });
  };
  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">{pageHeading}</h1>
      <p className="text-foreground">{pageDescription}</p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
        <Card className="w-full pt-4">
          {/* <CardHeader>
            <CardTitle>{t('listing.upload.heading')}</CardTitle>
            <CardDescription>{t('listing.upload.description')}</CardDescription>
          </CardHeader> */}
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FileUploadField
                  control={form.control}
                  name="heroImageUrl"
                  label={t('listing.upload.form.heroImageUrl.label')}
                />
                <TextInputField
                  name="title"
                  control={form.control}
                  label={t('listing.upload.form.listingName.label')}
                  placeholder={t('listing.upload.form.listingName.placeholder')}
                  required
                />
                <AddressAutocompleteField
                  name="address"
                  label={t('listing.upload.form.address.label')}
                  placeholder={t('listing.upload.form.address.placeholder')}
                  control={form.control}
                  onSelectAddress={(address) => {
                    form.setValue('geoLat', address.lat);
                    form.setValue('geoLng', address.lon);
                  }}
                  required
                />
                <DateTimePickerField
                  name="eventStart"
                  control={form.control}
                  showTime={true}
                  label={t('listing.upload.form.startDate.label')}
                  placeholder={t('listing.upload.form.startDate.placeholder')}
                  required
                />
                <DateTimePickerField
                  name="eventEnd"
                  control={form.control}
                  showTime={true}
                  label={t('listing.upload.form.endDate.label')}
                  placeholder={t('listing.upload.form.endDate.placeholder')}
                  required
                />
                <DropdownField
                  name="cities"
                  control={form.control}
                  placeholder={t('listing.upload.form.city.placeholder')}
                  label={t('listing.upload.form.city.label')}
                  options={fetchedCityData}
                  required
                  maxCount={1}
                />
                {!!fetchedCategoryData?.length && (
                  <SingleDropdownField
                    name="categories"
                    control={form.control}
                    placeholder={t('listing.upload.form.category.placeholder')}
                    label={t('listing.upload.form.category.label')}
                    options={fetchedCategoryData}
                    required
                  />
                )}
                {!!fetchedSubCategoryData?.length && (
                  <DropdownField
                    name="subCategories"
                    control={form.control}
                    placeholder={t(
                      'listing.upload.form.subCategory.placeholder'
                    )}
                    label={t('listing.upload.form.subCategory.label')}
                    options={fetchedSubCategoryData}
                  />
                )}

                <DropdownField
                  name="tags"
                  control={form.control}
                  placeholder={t('listing.upload.form.tags.placeholder')}
                  label={t('listing.upload.form.tags.label')}
                  options={fetchedTagsData}
                  required
                />

                <TextInputField
                  name="summary"
                  control={form.control}
                  label={t('listing.upload.form.summary.label')}
                  placeholder={t('listing.upload.form.summary.placeholder')}
                  required
                />
                <RichTextField
                  name="content"
                  control={form.control}
                  label={t('listing.upload.form.listingDescription.label')}
                  className="h-32 overflow-y-auto"
                  placeholder={t(
                    'listing.upload.form.listingDescription.placeholder'
                  )}
                  required
                />
                <TextInputField
                  name="contactEmail"
                  control={form.control}
                  label={t('listing.upload.form.email.label')}
                  placeholder={t('listing.upload.form.email.placeholder')}
                  required
                />
                <TextInputField
                  name="contactPhone"
                  control={form.control}
                  label={t('listing.upload.form.phone.label')}
                  placeholder={t('listing.upload.form.phone.placeholder')}
                />
                <TextInputField
                  name="website"
                  control={form.control}
                  label={t('listing.upload.form.websiteUrl.label')}
                  placeholder={t('listing.upload.form.websiteUrl.placeholder')}
                  required
                />
                <MultiFileUploadField
                  name="media"
                  label={t('listing.upload.form.media.label')}
                  control={form.control}
                  multiple={true}
                />
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1" loading={loading}>
                    <SaveAll className="size-7" />{' '}
                    {t('accountSetting.form.saveBtn')}
                  </Button>
                  <Button
                    variant="outline"
                    type="reset"
                    className="flex-1 border text-foreground"
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

        <ListingUploadPreview
          {...{
            title,
            websiteUrl,
            summary,
            description,
            contactEmail,
            contactPhone,
            categories,
            heroImageUrl,
            address,
            startDate,
            endDate,
            tags,
            fetchedCategoryData,
            fetchedSubCategoryData,
            subCategories,
            fetchedTagsData,
          }}
        />
      </div>
    </div>
  );
}

export default ListFormUpload;

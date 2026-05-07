import { RotateCcw, SaveAll } from 'lucide-react';
import { useCallback, useMemo } from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { formatISO } from 'date-fns';
import { toast } from 'sonner';

import { Category, CreateListingPayload } from '@/api/endpoints';
import {
  useCreateListMutate,
  useGetAllTags,
  useGetCityCategories,
  useGetCityList,
  useGetSelectedListing,
  useUpdateListingMutate,
  useUploadHeroImageMutate,
  useUploadMediaMutate,
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

import ListingUploadPreview from './ListingUploadPreview';

function flattenCategories(categories: Category[]): Category[] {
  const result: Category[] = [];

  const traverse = (catList: Category[]) => {
    for (const cat of catList) {
      // Push current category without children
      result.push({ ...cat, children: [] });

      // Recursively flatten children
      if (cat.children?.length) {
        traverse(cat.children);
      }
    }
  };

  traverse(categories);
  return result;
}

// const SELECTED_LISTING_ID = '1bfbc2d5-6188-4903-823e-4922228b44d1';

function ListingUpload() {
  const { listingId } = useParams();

  const {
    data: selectedListingData,
    isLoading,
    isFetching,
  } = useGetSelectedListing(listingId);

  const updateListing = useUpdateListingMutate();
  const createListing = useCreateListMutate();
  const uploadHeroImageMutate = useUploadHeroImageMutate();
  const uploadMediaMutate = useUploadMediaMutate();

  const { t } = useTypedTranslation();

  const { data: allTagsData } = useGetAllTags({
    page: 1,
    pageSize: 50,
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
    values: selectedListingData?.success
      ? (selectedListingData.data as ListUploadForm)
      : undefined,
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
      const flatList = flattenCategories(categoriesApiData.data?.items);

      return flatList.map((cat) => ({
        label: cat.name,
        value: cat.id,
      }));
    } else {
      return [];
    }
  }, [categoriesApiData]);

  const title = useWatch({ control: form.control, name: 'title' });
  const websiteUrl = useWatch({ control: form.control, name: 'website' });
  const summary = useWatch({ control: form.control, name: 'summary' });
  const description = useWatch({ control: form.control, name: 'content' });
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
    const categories = formValues.categories.map((cat) => ({
      categoryId: cat,
    }));
    const cities = formValues.cities.map((city) => ({ cityId: city }));
    const tags = formValues.tags.map((tag) => ({ tagId: tag }));
    const createData: CreateListingPayload = {
      ...formValues,
      visibility: 'PUBLIC',
      sourceType: 'MANUAL',
      categories,
      cities,
      tags,
      eventEnd: formatISO(formValues.eventEnd),
      eventStart: formatISO(formValues.eventStart),
      geoLat: Number(formValues.geoLat),
      geoLng: Number(formValues.geoLng),
    };
    if (listingId) {
      updateListing.mutate(
        {
          listingId,
          payload: createData,
        },
        {
          onSuccess: (data) => {
            if (data.success) {
              toast.success(data.message || 'Successfully updated listing');
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
            formValues.media &&
            formValues.media.every((formMedia) => formMedia instanceof File)
          ) {
            handleUploadMedia(formValues.media, data.data.id);
          }
          toast.success(data.message || 'Successfully created listing');
        }
      },
    });
  };

  if (listingId && isFetching && isLoading)
    return <Spinner className="size-8" />;

  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">
        {t('listing.upload.heading')}
      </h1>
      <p className="text-foreground">{t('listing.upload.description')}</p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
        <Card className="w-full">
          <CardHeader>
            <CardTitle>{t('listing.upload.heading')}</CardTitle>
            <CardDescription>{t('listing.upload.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FileUploadField
                  control={form.control}
                  name="heroImageUrl"
                  required
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
                />
                <DateTimePickerField
                  name="eventStart"
                  control={form.control}
                  showTime={true}
                  label={t('listing.upload.form.startDate.label')}
                  placeholder={t('listing.upload.form.startDate.placeholder')}
                />
                <DateTimePickerField
                  name="eventEnd"
                  control={form.control}
                  showTime={true}
                  label={t('listing.upload.form.endDate.label')}
                  placeholder={t('listing.upload.form.endDate.placeholder')}
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
                  <DropdownField
                    name="categories"
                    control={form.control}
                    placeholder={t('listing.upload.form.category.placeholder')}
                    label={t('listing.upload.form.category.label')}
                    options={fetchedCategoryData}
                    required
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
                />
                <MultiFileUploadField
                  name="media"
                  label={t('listing.upload.form.media.label')}
                  control={form.control}
                  multiple={true}
                />
                <div className="flex space-x-2">
                  <Button type="submit" className="flex-1">
                    <SaveAll className="size-7" />{' '}
                    {t('accountSetting.form.saveBtn')}
                  </Button>
                  <Button
                    variant="outline"
                    type="reset"
                    className="flex-1 border-red-500 text-red-500"
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
            fetchedTagsData,
          }}
        />
      </div>
    </div>
  );
}

export default ListingUpload;

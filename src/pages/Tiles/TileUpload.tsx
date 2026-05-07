import { RotateCcw, SaveAll } from 'lucide-react';
import { useCallback } from 'react';

import { useForm, useWatch } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useGetCityList } from '@/api/queries/cityList';
import { useUploadImage } from '@/api/queries/imageUpload';
import {
  useCreateTileUpload,
  useEditTileUpload,
  useGetTile,
} from '@/api/queries/tileUpload';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Form } from '@/components/ui/form';
import { useTypedTranslation } from '@/hooks';
import TileUploadPreview from '@/pages/Tiles/TileUploadPreview';
import { TileUploadForm, tileUploadSchema } from '@/schema/tileUpload';
import {
  ColorPickerField,
  FileUploadField,
  RichTextField,
  TextInputField,
} from '@/shared/FormField';

function TileUpload() {
  const { t } = useTypedTranslation();
  const { id } = useParams();
  const createTile = useCreateTileUpload();
  const uploadImage = useUploadImage();
  const navigate = useNavigate();
  const { data: tileData } = useGetTile(id ?? '');
  const editTile = useEditTileUpload();
  const { data: cityListData } = useGetCityList();
  const heading = id ? t('tile.edit.heading') : t('tile.upload.heading');
  const description = id
    ? t('tile.edit.description')
    : t('tile.upload.description');
  const form = useForm<TileUploadForm>({
    resolver: zodResolver(tileUploadSchema),
    values: tileData?.success ? (tileData.data as TileUploadForm) : undefined,
    defaultValues: {
      header: '',
      websiteUrl: null,
      headerBackgroundColor: '',
      iconImageUrl: null,
      subheader: '',
      description: '',
      contentBackgroundColor: '',
      backgroundImageUrl: null,
    },
  });
  const tileName = useWatch({ control: form.control, name: 'header' });
  const titleColor = useWatch({
    control: form.control,
    name: 'headerBackgroundColor',
  });
  const tileIcon = useWatch({ control: form.control, name: 'iconImageUrl' });
  const subHeader = useWatch({ control: form.control, name: 'subheader' });
  const tileDescription = useWatch({
    control: form.control,
    name: 'description',
  });
  const tileDescriptionColor = useWatch({
    control: form.control,
    name: 'contentBackgroundColor',
  });
  const tileImage = useWatch({
    control: form.control,
    name: 'backgroundImageUrl',
  });

  const extractFile = async (raw: string | File | null) => {
    if (!raw) return null;

    if (raw instanceof File) return raw;

    if (typeof raw === 'string') {
      try {
        const res = await fetch(raw);
        if (!res.ok) return null;

        const blob = await res.blob();
        const ext = (blob.type.split('/')[1] ?? 'jpg').split('+')[0];
        return new File([blob], `image.${ext}`, { type: blob.type });
      } catch (err) {
        console.error('Image URL → File error', err);
        return null;
      }
    }

    return null;
  };

  // TODO: Fix types
  const onSubmit = useCallback(
    async (data: TileUploadForm) => {
      const cityId = cityListData?.success && cityListData?.data?.items[0]?.id;

      const citiesPayload = id
        ? [{ id, cityId, isPrimary: false, displayOrder: 0 }]
        : [{ cityId, isPrimary: false, displayOrder: 0 }];

      const finalPayload = { ...data, cities: citiesPayload };

      const uploadImages = async (tileId: string) => {
        const bgRaw = form.getValues('backgroundImageUrl');
        const iconRaw = form.getValues('iconImageUrl');
        const bgFile = bgRaw instanceof File ? await extractFile(bgRaw) : null;
        const iconFile =
          iconRaw instanceof File ? await extractFile(iconRaw) : null;

        // Upload Background
        if (bgFile) {
          uploadImage.mutate({
            payload: { file: bgFile },
            id: tileId,
            path: 'background-image',
          });
        }

        // Upload Icon
        if (iconFile) {
          uploadImage.mutate({
            payload: { file: iconFile },
            id: tileId,
            path: 'icon-image',
          });
        }
      };

      if (id) {
        editTile.mutate(
          { tileId: id, payload: finalPayload },
          {
            onSuccess: async (resp) => {
              if (!resp.success) {
                toast.error(resp.error);
                return;
              }

              toast.success(resp.message);
              await uploadImages(id);

              navigate(`/tiles/listing`);
            },
          }
        );
        return;
      }

      createTile.mutate(finalPayload, {
        onSuccess: async (resp) => {
          if (!resp.success) {
            toast.error(resp.error);
            return;
          }

          const tileID = resp.data?.id;
          if (!tileID) return;

          toast.success(resp.message);

          await uploadImages(tileID);

          navigate(`/tiles/listing`);
        },
      });
    },
    [id, createTile, editTile, form, uploadImage, cityListData, navigate]
  );

  return (
    <div className="w-full px-1">
      <h1 className="text-2xl font-semibold text-foreground">{heading}</h1>
      <p className="text-foreground">{description}</p>

      <div className="grid lg:grid-cols-2 grid-cols-1 gap-4 w-full mt-8">
        <Card className="w-full pt-4">
          {/* <CardHeader>
            <CardTitle>{t('tile.upload.heading')}</CardTitle>
            <CardDescription>{t('tile.upload.description')}</CardDescription>
          </CardHeader> */}
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <TextInputField
                  name="displayOrder"
                  control={form.control}
                  type="number"
                  label={t('tile.upload.form.displayOrder.label')}
                  placeholder={t('tile.upload.form.displayOrder.placeholder')}
                />
                <TextInputField
                  name="header"
                  control={form.control}
                  label={t('tile.upload.form.tileName.label')}
                  placeholder={t('tile.upload.form.tileName.placeholder')}
                  required
                />

                <TextInputField
                  name="websiteUrl"
                  control={form.control}
                  label={t('tile.upload.form.redirectURL.label')}
                  placeholder={t('tile.upload.form.redirectURL.placeholder')}
                />

                <ColorPickerField
                  control={form.control}
                  name="headerBackgroundColor"
                  label={t('tile.upload.form.titleColor.label')}
                  required
                />

                <FileUploadField
                  control={form.control}
                  name="iconImageUrl"
                  label={t('tile.upload.form.tileIcon.label')}
                />

                <TextInputField
                  name="subheader"
                  control={form.control}
                  label={t('tile.upload.form.subHeader.label')}
                  placeholder={t('tile.upload.form.subHeader.label')}
                  required
                />

                <RichTextField
                  name="description"
                  control={form.control}
                  label={t('tile.upload.form.tileDescription.label')}
                  className="h-32 overflow-y-auto"
                  placeholder={t(
                    'tile.upload.form.tileDescription.placeholder'
                  )}
                  required
                />

                <ColorPickerField
                  control={form.control}
                  name="contentBackgroundColor"
                  required
                  label={t('tile.upload.form.titleDescriptionColor.label')}
                />

                <FileUploadField
                  control={form.control}
                  name="backgroundImageUrl"
                  required
                  label={t('tile.upload.form.tileImage.label')}
                />

                <div className="flex gap-5 flex-col md:flex-row justify-center pt-4 items-center">
                  <Button type="submit" className="w-52">
                    <SaveAll className="size-7" />{' '}
                    {t('accountSetting.form.saveBtn')}
                  </Button>
                  {/* TODO: Fix hovering */}
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

        <TileUploadPreview
          {...{
            tileName,
            titleColor,
            tileIcon,
            subHeader,
            tileDescription,
            tileDescriptionColor,
            tileImage,
          }}
        />
      </div>
    </div>
  );
}

export default TileUpload;

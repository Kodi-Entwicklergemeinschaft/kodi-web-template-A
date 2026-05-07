import { Plus, SaveAll, Trash2 } from 'lucide-react';

import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';

import { useProfileMetaDataMutation } from '@/api/queries';
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
import { cn } from '@/lib/utils';
import { MetaDataForm, metadataSchema } from '@/schema/profile';
import { FormSelectField, TextInputField } from '@/shared/FormField';

type MetadataFormProps = {
  loading: boolean;
  metadata?: MetaDataForm['metadata'];
};

const WEBSITE_OPTIONS = [
  { value: 'google', label: 'Google' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter' },
];

function MetadataForm({ loading, metadata }: MetadataFormProps) {
  const { t } = useTypedTranslation();

  const updateMetaData = useProfileMetaDataMutation();

  const form = useForm<MetaDataForm>({
    resolver: zodResolver(metadataSchema),
    values: {
      metadata: metadata || [
        {
          link: '',
          name: '',
        },
      ],
    },
    defaultValues: {
      metadata: metadata || [
        {
          link: '',
          name: '',
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    rules: {
      maxLength: 3,
    },
    name: 'metadata',
  });

  const onSubmit = (data: MetaDataForm) => {
    updateMetaData.mutate(data.metadata, {
      onSuccess: (data) => {
        if (data.success) {
          toast.success(data.message);
        } else {
          toast.error(data.error);
        }
      },
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t('accountSetting.section.metadata.heading')}</CardTitle>
        <CardDescription>
          {t('accountSetting.section.metadata.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center">
            <Spinner />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className={cn(
                    'flex flex-col md:flex-row gap-3 md:items-end  rounded-lg ',
                    index && 'my-4'
                  )}
                >
                  {/* Select for website name */}
                  <div className="flex-1">
                    <FormSelectField
                      control={form.control}
                      name={`metadata.${index}.name`}
                      label={t('accountSetting.form.website.label')}
                      placeholder={t('accountSetting.form.website.placeholder')}
                      options={WEBSITE_OPTIONS}
                    />
                  </div>

                  {/* Input for website link */}
                  <div className="flex-1">
                    <TextInputField
                      control={form.control}
                      name={`metadata.${index}.link`}
                      label={t('accountSetting.form.website.placeholder')}
                      placeholder="Enter the link"
                    />
                  </div>

                  {/* Delete button */}
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="w-8 h-8 items-center justify-center"
                    aria-label={t('deleteMetadata')}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}

              {/* Add new social link */}
              <div className="flex  md:flex-row gap-3 mt-5 flex-col-reverse">
                <Button type="submit" className="w-40">
                  <SaveAll className="size-7" />{' '}
                  {t('accountSetting.form.saveBtn')}
                </Button>
                {fields.length < WEBSITE_OPTIONS.length && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() =>
                      append({
                        name: '',
                        link: '',
                        id: undefined,
                      })
                    }
                    className="flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    {t('addMore')}
                  </Button>
                )}
              </div>
            </form>
          </Form>
        )}
      </CardContent>
    </Card>
  );
}

export default MetadataForm;

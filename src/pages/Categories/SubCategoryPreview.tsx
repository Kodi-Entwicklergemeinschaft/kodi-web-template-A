import { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTypedTranslation } from '@/hooks';

type CategoryPreviewProps = {
  categoryName?: string | undefined;
  subtitle?: string | undefined;
  headerColor?: string | null | undefined;
  categoryIcon?: null | File | string;
  categoryDescription?: string | undefined;
  contentColor?: string | undefined;
  categoryImage?: null | File | string;
  previewTitle?: string | undefined;
};

const SubCategoryPreview = ({
  categoryName,
  headerColor,
  categoryIcon,
  categoryImage,
  previewTitle,
}: CategoryPreviewProps) => {
  const { t } = useTypedTranslation();
  const displayCategoryName =
    categoryName || t('category.create.preview.defaultName');

  const categoryImagePreview = useMemo(
    () =>
      typeof categoryImage === 'string'
        ? `${categoryImage}?cb=${new Date().getTime()}`
        : categoryImage
          ? URL.createObjectURL(categoryImage)
          : undefined,
    [categoryImage]
  );

  const categoryIconPreview = useMemo(
    () =>
      typeof categoryIcon === 'string'
        ? `${categoryIcon}?cb=${new Date().getTime()}`
        : categoryIcon
          ? URL.createObjectURL(categoryIcon)
          : undefined,
    [categoryIcon]
  );
  return (
    <Card className="w-full max-h-max">
      <CardHeader>
        <CardTitle>
          {previewTitle || t('category.create.preview.citySubHeading')}
        </CardTitle>
        <CardDescription>
          {t('category.create.preview.citySubDescription')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div
            className="min-h-80 bg-background border border-border rounded-lg max-w-sm mx-auto shadow-lg overflow-hidden max-h-72 bg-center bg-cover flex flex-col-reverse pb-8 justify-between"
            style={{
              backgroundImage: `url(${categoryImagePreview ?? 'https://picsum.photos/800'})`,
            }}
          >
            <div
              className="bg-lime-500 mt-8 max-w-52 p-1 rounded-lg flex items-center gap-2 font-semibold"
              style={{ backgroundColor: headerColor || '#84CC16' }}
            >
              {categoryIconPreview && (
                <img
                  src={categoryIconPreview}
                  alt="categoryIcon"
                  className="size-5 object-cover"
                />
              )}
              <p
                className="text-sm"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.5em',
                  maxHeight: '3em',
                }}
              >
                {displayCategoryName}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SubCategoryPreview;

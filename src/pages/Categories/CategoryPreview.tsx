import { useMemo } from 'react';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTypedTranslation } from '@/hooks';
import { normalizeRichTextHtml } from '@/lib/richText';

type CategoryPreviewProps = {
  // categoryName?: string | undefined;
  // subtitle?: string | null;
  // headerColor?: string | null | undefined;
  // categoryIcon?: null | File | string;
  // categoryDescription?: string | undefined;
  // contentColor?: string | null | undefined;
  // categoryImage?: null | File | string;
  // previewTitle?: string | undefined;
  categoryName?: string | null;
  subtitle?: string | null;
  headerColor?: string | null;
  categoryIcon?: string | File | null;
  categoryDescription?: string | null;
  contentColor?: string | null;
  categoryImage?: string | File | null;
  previewTitle?: string;
  description?: string | null;
};

const CategoryPreview = ({
  categoryName,
  subtitle,
  headerColor,
  categoryIcon,
  categoryDescription,
  contentColor,
  categoryImage,
  previewTitle,
  description,
}: CategoryPreviewProps) => {
  const { t } = useTypedTranslation();
  const displayCategoryName =
    categoryName || t('category.create.preview.defaultName');
  const displaySubtitle =
    subtitle || t('category.create.preview.defaultSubtitle');
  const displayDescription = normalizeRichTextHtml(
    categoryDescription || t('category.create.preview.defaultDescription')
  );

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
          {previewTitle || t('category.create.preview.heading')}
        </CardTitle>
        <CardDescription>
          {description || t('category.create.preview.description')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div
            className="min-h-80 bg-background border border-border rounded-lg max-w-sm mx-auto shadow-lg overflow-hidden max-h-72 bg-center bg-cover flex flex-col justify-between"
            style={{
              backgroundImage: `url(${categoryImagePreview ?? 'https://picsum.photos/800'})`,
            }}
          >
            <div
              className="bg-lime-500 text-black mt-8 max-w-52 p-1 rounded-lg flex items-center gap-2 font-semibold"
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
            <div
              className="bg-lime-500 text-black mt-20 mb-1 max-w-52 p-1 rounded-tr-lg rounded-br-lg flex items-center gap-2 font-semibold"
              style={{ backgroundColor: headerColor || '#84CC16' }}
            >
              <p
                className="text-sm"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  WebkitLineClamp: 2,
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.5em',
                  maxHeight: '3em',
                }}
              >
                {displaySubtitle}
              </p>
            </div>
            <div
              className="mb-4 max-w-52 p-2 rounded-tr-lg rounded-br-lg text-white"
              style={{
                backgroundColor: contentColor || '#0846AA',
              }}
            >
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.5em',
                  maxHeight: '9em',
                }}
                className="text-sm rich-text-content max-h-40 overflow-y-auto pr-2"
                dangerouslySetInnerHTML={{
                  __html: displayDescription,
                }}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CategoryPreview;

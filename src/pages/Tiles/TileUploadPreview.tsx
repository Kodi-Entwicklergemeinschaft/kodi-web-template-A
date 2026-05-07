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

type TileUploadPreviewProps = {
  tileName?: string | undefined;
  titleColor?: string | undefined;
  tileIcon?: null | File | string;
  subHeader?: string | undefined;
  tileDescription?: string | undefined;
  tileDescriptionColor?: string | undefined;
  tileImage?: null | File | string;
};

const TileUploadPreview = ({
  tileName,
  titleColor,
  tileIcon,
  subHeader,
  tileDescription,
  tileDescriptionColor,
  tileImage,
}: TileUploadPreviewProps) => {
  const { t } = useTypedTranslation();
  const displayTileName = tileName || t('tile.upload.dummyText');
  const displaySubHeader = subHeader || t('tile.upload.defaultHeader');
  const displayDescription = normalizeRichTextHtml(
    tileDescription || t('tile.upload.tilePreviewDescription')
  );
  const bkgImage = useMemo(
    () =>
      tileImage
        ? typeof tileImage === 'string'
          ? `${tileImage}?cb=${new Date().getTime()}`
          : tileImage
            ? URL.createObjectURL(tileImage)
            : undefined
        : 'https://picsum.photos/800',
    [tileImage]
  );

  const iconImg = useMemo(
    () =>
      typeof tileIcon === 'string'
        ? `${tileIcon}?cb=${new Date().getTime()}`
        : tileIcon
          ? URL.createObjectURL(tileIcon)
          : undefined,
    [tileIcon]
  );

  return (
    <Card className="w-full max-h-max">
      <CardHeader>
        <CardTitle>{t('tile.upload.previewHeading')}</CardTitle>
        <CardDescription>{t('tile.upload.previewDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 p-4 rounded-lg">
          <div
            className="bg-background border border-border rounded-lg max-w-sm mx-auto shadow-lg overflow-hidden max-h-72 bg-center bg-cover flex flex-col justify-between"
            style={{
              backgroundImage: `url(${bkgImage})`,
            }}
          >
            <div
              className="bg-lime-500 mt-8 max-w-52 p-1 rounded-lg flex items-center gap-2 font-semibold"
              style={{ backgroundColor: titleColor }}
            >
              {tileIcon && (
                <img
                  src={iconImg}
                  alt="tileIcon"
                  className="size-5 object-cover"
                />
              )}
              <p
                className="text-sm text-black"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 2, // number of visible lines before truncation
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'normal',
                  wordBreak: 'break-word',
                  lineHeight: '1.5em',
                  maxHeight: '3em',
                }}
              >
                {displayTileName}
              </p>
            </div>
            {/* TODO: Fix this Description CSS */}
            <div
              className="mb-4 max-w-52 p-2 rounded-tr-lg rounded-br-lg text-white mt-16"
              style={{
                backgroundColor: tileDescriptionColor || '#0846AA',
              }}
            >
              <p
                className="font-semibold text-base"
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  WebkitLineClamp: 2,
                  textOverflow: 'ellipsis',
                }}
              >
                {displaySubHeader}
              </p>
              <div
                style={{
                  display: '-webkit-box',
                  WebkitBoxOrient: 'vertical',
                  WebkitLineClamp: 4, // number of visible lines before truncation
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

export default TileUploadPreview;

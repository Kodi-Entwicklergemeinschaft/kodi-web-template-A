import { Clock, Home, Mail, MapPin, Phone } from 'lucide-react';
import React, { useMemo } from 'react';

import { format } from 'date-fns';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useTypedTranslation } from '@/hooks';

type DrpDownData = Record<'label' | 'value', string>;

type ListingUploadPreviewProps = {
  title?: string | undefined;
  websiteUrl?: string | undefined;
  summary?: string | undefined;
  description?: string | undefined;
  contactEmail?: string | undefined;
  contactPhone?: string | undefined;
  categories?: string[] | undefined;
  subCategories?: string[] | undefined;
  heroImageUrl?: string | File | null;
  address?: string | undefined;
  startDate?: string | Date | undefined;
  endDate?: string | Date | undefined;
  tags: string[];
  fetchedCategoryData: DrpDownData[];
  fetchedSubCategoryData?: DrpDownData[];
  fetchedTagsData: DrpDownData[];
};

const ListingUploadPreview = ({
  title,
  websiteUrl,
  summary,
  description,
  contactEmail,
  contactPhone,
  categories,
  subCategories,
  heroImageUrl,
  address,
  startDate,
  endDate,
  tags,
  fetchedCategoryData,
  fetchedSubCategoryData,
  fetchedTagsData,
}: ListingUploadPreviewProps) => {
  const { t } = useTypedTranslation();
  const displayListingName = title || t('tile.upload.dummyText');
  const displaySubHeader = summary || t('list.upload.defaultHeader');
  const displayDescription =
    description || t('tile.upload.tilePreviewDescription');
  const startDateIso = startDate
    ? format(new Date(startDate ?? ''), 'dd/MM/yyyy, HH:mm')
    : t('list.upload.dateFormat');
  const endDateIso = endDate
    ? format(new Date(endDate), 'dd/MM/yyyy, HH:mm')
    : t('list.upload.dateFormat');
  const filteredCat = fetchedCategoryData
    .filter((cat) => categories?.includes(cat.value))
    .map((cat) => cat.label);
  const filteredSubCat = (fetchedSubCategoryData ?? [])
    .filter((cat) => subCategories?.includes(cat.value))
    .map((cat) => cat.label);
  const filteredTags = fetchedTagsData
    .filter((tag) => tags?.includes(tag.value))
    .map((tag) => tag.label);
  const emailPrev = contactEmail || 'dummy@gmail.com';
  const websitePrev = websiteUrl || 'www.dummy.com';
  const heroUrlImagePrev = useMemo(
    () =>
      heroImageUrl
        ? typeof heroImageUrl === 'string'
          ? heroImageUrl.concat(`?cb=${new Date().getTime()}`)
          : heroImageUrl
            ? URL.createObjectURL(heroImageUrl)
            : undefined
        : 'https://picsum.photos/800',
    [heroImageUrl]
  );

  return (
    <Card className="w-full max-h-max">
      <CardHeader>
        <CardTitle>{t('list.upload.previewHeading')}</CardTitle>
        <CardDescription>{t('list.upload.previewDescription')}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="bg-muted/30 p-4 rounded-lg">
          <img
            src={`${heroUrlImagePrev}`}
            className="w-full max-h-80"
            alt={displayListingName}
          ></img>
          <p
            className="text-lg font-bold pt-2 pb-2"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 1, // number of visible lines before truncation
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'normal',
              wordBreak: 'break-word',
              lineHeight: '1.7em',
              maxHeight: '3em',
            }}
          >
            {displayListingName}
          </p>
          <div>
            {address && (
              <div className="flex gap-2 pb-2">
                <MapPin />
                {address}
              </div>
            )}
            {startDateIso && endDateIso && (
              <div className="flex gap-2">
                <Clock size={20} className="mt-0.5" />
                <span className="">{startDateIso + ' - ' + endDateIso}</span>
              </div>
            )}
          </div>
          <div className="w-full flex flex-wrap gap-1">
            {filteredCat?.map((cat) => (
              <span
                key={cat}
                className="p-2 border rounded-lg text-white"
                style={{ backgroundColor: '#4D4F5C' }}
              >
                {cat}
              </span>
            ))}
          </div>
          <div className="w-full flex flex-wrap gap-1">
            {filteredSubCat?.map((cat) => (
              <span
                key={cat}
                className="p-2 border rounded-lg text-white"
                style={{ backgroundColor: '#4D4F5C' }}
              >
                {cat}
              </span>
            ))}
          </div>
          <div className="w-full flex flex-wrap gap-1">
            {filteredTags?.map((tag) => (
              <span
                key={tag}
                className="p-2 border rounded-lg bg-primary text-white my-3"
                style={{ backgroundColor: '#4D4F5C' }}
              >
                {tag}
              </span>
            ))}
          </div>
          <div>
            <p
              className="text-lg font-bold pt-2 pb-2"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2, // number of visible lines before truncation
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'normal',
                wordBreak: 'break-word',
                lineHeight: '1.4em',
                maxHeight: '3em',
              }}
            >
              {displaySubHeader}
            </p>
            <p
              className="text-sm pt-2"
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
              dangerouslySetInnerHTML={{
                __html: displayDescription,
              }}
            />
          </div>
          <div>
            {websitePrev && (
              <div className="flex gap-2">
                <Home /> {websitePrev}
              </div>
            )}
            {emailPrev && (
              <div className="flex gap-2">
                <Mail /> {emailPrev}
              </div>
            )}
            {contactPhone && (
              <div className="flex gap-2">
                <Phone /> {contactPhone}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(ListingUploadPreview);

import apiRequest from '@/api/apiRequest';
import API_URLS from '@/api/apiURl';

export interface ListingTag {
  id: string;
  tagId: string;
  provider: string;
  externalValue: string;
  label: string;
  languageCode: string;
}

export type ListingTagList = ListingTag[];

export interface MediaItem {
  id: string;
  type: 'IMAGE' | 'VIDEO' | string; // extend if needed
  url: string;
  altText: string;
  caption: string;
  order: number;
  metadata: {
    width: number;
    height: number;
  };
}

export type Media = MediaItem[];

export type ListData = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  moderationStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | string;
  visibility: 'PUBLIC' | 'PRIVATE' | string;
  isFeatured: boolean;
  featuredUntil: string; // ISO date
  publishAt: string; // ISO date
  expireAt: string; // ISO date
  languageCode: string;
  sourceUrl: string | null;
  heroImageUrl: string | null;

  tags: ListingTagList;
  metadata: {
    tags: string[];
    heroImageUrl: string | null;
    media: Media;
  };

  viewCount: number;
  likeCount: number;
  shareCount: number;
  isFavorite: boolean;

  createdByUserId: string;
  lastEditedByUserId: string | null;
  reviewedBy: string | null;
  reviewedAt: string | null;
  reviewNotes: string | null;

  sourceType: string;
  externalSource: string | null;
  externalId: string | null;
  syncHash: string | null;
  contentChecksum: string | null;
  lastSyncedAt: string | null;
  ingestedAt: string | null;
  ingestedByService: string | null;
  ingestNotes: string | null;

  primaryCityId: string | null;
  venueName: string | null;
  address: string | null;
  geoLat: number | null;
  geoLng: number | null;
  timezone: string | null;

  contactPhone: string | null;
  contactEmail: string | null;
  website: string | null;

  eventStart: string | null;
  eventEnd: string | null;
  isAllDay: boolean;

  organizerName: string | null;
  organizerContact: string | null;
  registrationUrl: string | null;

  isArchived: boolean;
  archivedAt: string | null;
  archivedBy: string | null;

  createdAt: string;
  updatedAt: string;

  categories: Array<{
    id: string;
    categoryId: string;
    parentId: string | null;
    name: string;
    slug: string;
    type: string;
  }>;

  cities: Array<{
    id: string;
    cityId: string;
    isPrimary: boolean;
    displayOrder: number;
  }>;

  media: Media;

  timeIntervals?: Array<{
    id: string;
    weekdays: string[];
    start: string; // ISO datetime
    end: string; // ISO datetime
    tz: string;
    freq: string;
    interval: number;
    repeatUntil: string;
    metadata?: Record<string, unknown>;
  }>;

  timeIntervalExceptions?: Array<{
    id: string;
    date: string;
    opensAt: string | null;
    closesAt: string | null;
    isClosed: boolean;
    metadata?: Record<string, unknown>;
  }>;
};

export type ListingDataResponse = {
  items: ListData[];
  meta: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
};

export type ListingsQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  showExternalListings?: boolean;
  statusId: number;
  sortBy: string;
  sortDirection: string;
  isActive?: boolean;
};

export type CreateListingPayload = {
  title: string;
  summary: string;
  content: string;
  visibility: 'PUBLIC' | 'PRIVATE' | 'UNLISTED';
  sourceType: 'MANUAL' | 'AUTOMATED' | string;

  categories: {
    categoryId: string;
  }[];
  cities: {
    cityId: string;
  }[];
  tags: {
    tagId: string;
  }[];

  address?: string | null;
  geoLat?: string | number | null;
  geoLng?: string | number | null;
  timezone?: string | null;

  contactPhone?: string | null;
  contactEmail?: string | null;
  website?: string | null;

  eventStart?: string | null;
  eventEnd?: string | null;
};

type HeroImageUploadResponse = {
  listing: ListData;
  imageUrl: string;
};

export const getListings = async (queryParams: ListingsQueryParams) => {
  return await apiRequest<ListingDataResponse>({
    url: API_URLS.Listings,
    method: 'GET',
    params: queryParams,
  });
};

export const getSelectedListing = async (listId: string) => {
  return await apiRequest<ListData>({
    url: `${API_URLS.Listings}/${listId}`,
    method: 'GET',
  });
};

export const deleteListing = async (listId: number | string) => {
  return await apiRequest({
    url: `${API_URLS.Listings}/${listId}`,
    method: 'DELETE',
  });
};

export const createListing = async (payload: CreateListingPayload) => {
  return await apiRequest<ListData>({
    url: API_URLS.Listings,
    method: 'POST',
    data: payload,
  });
};

export const uploadHeroImage = async ({
  listingId,
  heroImage,
}: {
  listingId: string;
  heroImage: File;
}) => {
  const formData = new FormData();
  formData.append('file', heroImage);
  return await apiRequest<HeroImageUploadResponse>({
    url: `${API_URLS.Listings}/${listingId}/${API_URLS.HeroImage}`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const uploadMedia = async ({
  listingId,
  mediaFiles,
}: {
  listingId: string;
  mediaFiles: File[];
}) => {
  const formData = new FormData();

  mediaFiles.forEach((file) => {
    formData.append('files', file);
  });
  return await apiRequest<Media>({
    url: `${API_URLS.Listings}/${listingId}/${API_URLS.Media}`,
    method: 'POST',
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const updateListingData = async ({
  listingId,
  payload,
}: {
  listingId: string;
  payload: CreateListingPayload;
}) => {
  return await apiRequest<ListData>({
    url: `${API_URLS.Listings}/${listingId}`,
    method: 'PATCH',
    data: payload,
  });
};

export const archiveList = async ({
  listingId,
}: {
  listingId: string | number;
}) => {
  return await apiRequest<ListData>({
    url: `${API_URLS.Listings}/${listingId}/archive`,
    method: 'POST',
    data: {
      reviewNotes: 'Event cancelled by organizer.',
    },
  });
};

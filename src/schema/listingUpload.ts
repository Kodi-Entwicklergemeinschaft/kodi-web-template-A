import { z } from 'zod';

import { REGEX } from '@/lib/regexConstant';

export const listingUploadSchema = z
  .object({
    title: z
      .string({
        error: 'formMessages.uploadListing.errorName.listingNameRequired',
      })
      .min(3, {
        message: 'formMessages.uploadListing.errorName.listingNameMinLength',
      })
      .max(50, {
        message: 'formMessages.uploadListing.errorName.listingNameMaxLength',
      }),
    address: z
      .string({
        error: 'formMessages.uploadListing.errorName.address',
      })
      .trim() // ✅ removes spaces before validation
      .min(2, { error: 'formMessages.address.errorName.minLength' })
      .max(200, { error: 'formMessages.address.errorName.maxLength' }),
    geoLat: z.string(),
    geoLng: z.string(),
    eventStart: z
      .string({ error: 'formMessages.uploadListing.errorName.startDate' })
      .or(z.date({ error: 'formMessages.uploadListing.errorName.startDate' })),
    eventEnd: z
      .string({ error: 'formMessages.uploadListing.errorName.endDate' })
      .or(z.date({ error: 'formMessages.uploadListing.errorName.endDate' })),
    website: z
      .string()
      .min(5, { message: 'formMessages.uploadListing.errorName.websiteUrl' }),
    summary: z
      .string()
      .min(2, { message: 'formMessages.uploadField.errorName.subHeader' })
      .max(50, { message: 'formMessages.uploadField.errorName.subHeaderMax' }),

    content: z.string().min(10, {
      message: 'formMessages.uploadField.errorName.tileDescription',
    }),
    contactPhone: z
      .string({ error: 'formMessages.uploadListing.errorName.phoneNo' })
      .optional()
      .refine(
        (val) => !val || /^[0-9+\-()./ ]{6,50}$/.test(val),
        'accountSetting.form.phoneNumber.error.required'
      ),
    contactEmail: z
      .string()
      .min(3, 'invalidMail')
      .regex(REGEX.EMAIL, 'registration.form.email.error.invalidMail')
      .or(
        z
          .email('invalidMail')
          .min(3, 'minContainInMail')
          .max(50, 'maxContentInMail')
          .regex(REGEX.EMAIL, 'registration.form.email.error.invalidMail')
      ),
    cities: z
      .array(z.string({ error: 'formMessages.uploadListing.errorName.city' }))
      .min(1, {
        error: 'formMessages.uploadListing.errorName.city',
      }),
    categories: z.array(z.string()).min(1, {
      message: 'formMessages.uploadListing.errorName.category',
    }),
    subCategories: z.array(z.string()),
    tags: z
      .array(z.string())
      .min(1, { message: 'formMessages.uploadListing.errorName.tags' }),

    heroImageUrl: z.union([
      z.instanceof(File, {
        error: 'formMessages.uploadListing.errorName.heroImageRequired',
      }),
      z.string(),
      z.null(),
    ]),
    media: z.array(z.union([z.instanceof(File), z.string().url()])).nullable(),
  })
  .superRefine((data, ctx) => {
    // if one is missing, let required validators handle it
    if (!data.eventStart || !data.eventEnd) return;

    const start =
      data.eventStart instanceof Date
        ? data.eventStart
        : new Date(data.eventStart);
    const end =
      data.eventEnd instanceof Date ? data.eventEnd : new Date(data.eventEnd);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['eventEnd'],
        message: 'Invalid date', // or your translation key
      });
      return;
    }

    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['eventEnd'],
        // put your i18n key here if you have one
        message: 'End date must be greater than start date',
      });
    }
  });

export type ListUploadForm = z.infer<typeof listingUploadSchema>;

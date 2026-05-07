import { z } from 'zod';

export const tileUploadSchema = z.object({
  displayOrder: z
    .number()
    .min(1, { message: 'formMessages.uploadField.errorName.minDisplayOrder' })
    .max(999999, {
      message: 'formMessages.uploadField.errorName.maxDisplayOrder',
    })
    .optional(),
  header: z
    .string()
    .min(2, { message: 'formMessages.uploadField.errorName.minLength' })
    .max(50, { message: 'formMessages.uploadField.errorName.maxLength' }),

  websiteUrl: z.union([z.string(), z.null()]).optional(),

  headerBackgroundColor: z
    .string()
    .min(1, { message: 'formMessages.uploadField.errorName.titleColor' }),

  iconImageUrl: z.union([
    z.instanceof(File),
    z.string().pipe(z.string().url()),
    z.null(),
  ]),

  subheader: z
    .string()
    .min(2, { message: 'formMessages.uploadField.errorName.subHeader' })
    .max(50, { message: 'formMessages.uploadField.errorName.subHeaderMax' }),

  description: z
    .string()
    .min(10, { message: 'formMessages.uploadField.errorName.tileDescription' }),

  contentBackgroundColor: z.string().min(1, {
    message: 'formMessages.uploadField.errorName.titleDescriptionColor',
  }),

  backgroundImageUrl: z
    .union([z.instanceof(File), z.string().pipe(z.string().url()), z.null()])
    .refine((file) => file !== null, {
      message: 'formMessages.uploadField.errorName.tileImage',
    }),
});

export type TileUploadForm = z.infer<typeof tileUploadSchema>;

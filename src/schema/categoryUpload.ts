import { z } from 'zod';

export const categoryUploadSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'category.form.name.error.minLength' })
    .max(50, { message: 'category.form.name.error.maxLength' }),

  subtitle: z
    .string()
    .min(2, { message: 'category.form.subtitle.error.minLength' })
    .max(100, { message: 'category.form.subtitle.error.maxLength' }),

  description: z
    .string()
    .min(10, { message: 'category.form.description.error.minLength' }),

  headerBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.headerColor.error.required' }),

  contentBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.contentColor.error.required' }),

  iconImageUrl: z.union([
    z.instanceof(File),
    z.string().pipe(z.string().url()),
    z.null(),
  ]),

  backgroundImageUrl: z
    .union([z.instanceof(File), z.string().pipe(z.string().url()), z.null()])
    .refine((file) => file !== null, {
      message: 'category.form.backgroundImage.error.required',
    }),

  parentId: z.union([z.string(), z.null()]).optional(),

  isActive: z.enum(['true', 'false']),
});

export type CategoryUploadForm = z.infer<typeof categoryUploadSchema>;

export const subCategoryUploadSchema = categoryUploadSchema.extend({
  name: z
    .string()
    .min(2, { message: 'category.form.name.error.minLength' })
    .max(50, { message: 'category.form.name.error.maxLength' }),

  subtitle: z
    .string()
    .min(2, { message: 'category.form.subtitle.error.minLength' })
    .max(100, { message: 'category.form.subtitle.error.maxLength' })
    .optional(),

  description: z
    .string()
    .min(10, { message: 'category.form.description.error.minLength' })
    .optional(),
  contentBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.contentColor.error.required' })
    .optional(),

  headerBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.headerColor.error.required' }),

  backgroundImageUrl: z
    .union([z.instanceof(File), z.string().pipe(z.string().url()), z.null()])
    .refine((file) => file !== null, {
      message: 'category.form.backgroundImage.error.required',
    }),

  parentId: z.union([z.string(), z.null()]).optional(),

  isActive: z.enum(['true', 'false']),
});

export type SubCategoryUploadForm = z.infer<typeof subCategoryUploadSchema>;

export const editCityCategorySchema = z.object({
  displayOrder: z
    .number()
    .min(1, { message: 'formMessages.uploadField.errorName.minDisplayOrder' })
    .max(999999, {
      message: 'formMessages.uploadField.errorName.maxDisplayOrder',
    })
    .optional(),
  name: z
    .string()
    .min(2, { message: 'category.form.name.error.minLength' })
    .max(50, { message: 'category.form.name.error.maxLength' }),

  subtitle: z
    .string()
    .min(2, { message: 'category.form.subtitle.error.minLength' })
    .max(100, { message: 'category.form.subtitle.error.maxLength' })
    .optional(),

  description: z
    .string()
    .min(10, { message: 'category.form.description.error.minLength' })
    .optional(),

  headerBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.headerColor.error.required' }),

  contentBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.contentColor.error.required' })
    .nullish(),

  iconImageUrl: z
    .union([z.instanceof(File), z.string().pipe(z.string().url()), z.null()])
    .refine((file) => file !== null, {
      message: 'category.form.iconImageUrl.error.required',
    }),

  backgroundImageUrl: z
    .union([z.instanceof(File), z.string().pipe(z.string().url()), z.null()])
    .refine((file) => file !== null, {
      message: 'category.form.backgroundImage.error.required',
    }),

  parentId: z.union([z.string(), z.null()]).nullish(),

  isActive: z.enum(['true', 'false']),
  children: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: 'category.form.name.error.minLength' })
          .max(50, { message: 'category.form.name.error.maxLength' }),

        backgroundImageUrl: z
          .union([
            z.instanceof(File),
            z.string().pipe(z.string().url()),
            z.null(),
          ])
          .optional(),

        headerBackgroundColor: z.string().nullish().optional(),

        // subtitle: z
        //   .string()
        //   .min(2, { message: 'category.form.subtitle.error.minLength' })
        //   .max(100, { message: 'category.form.subtitle.error.maxLength' })
        //   .optional(),

        // description: z
        //   .string()
        //   .min(10, { message: 'category.form.description.error.minLength' })
        //   .optional(),

        // contentBackgroundColor: z
        //   .string()
        //   .min(1, { message: 'category.form.contentColor.error.required' })
        //   .optional(),

        // iconImageUrl: z
        //   .union([
        //     z.instanceof(File),
        //     z.string().pipe(z.string().url()),
        //     z.null(),
        //   ])
        //   .optional(),

        id: z.union([z.string(), z.null()]).optional(),
        parentId: z.union([z.string(), z.null()]).optional(),

        isActive: z.enum(['true', 'false']),
      })
    )
    .optional(),
});

export type EditCityCategoryForm = z.infer<typeof editCityCategorySchema>;

export const categoryUploadSchema1 = z.object({
  name: z
    .string()
    .min(2, { message: 'category.form.name.error.minLength' })
    .max(50, { message: 'category.form.name.error.maxLength' }),

  subtitle: z
    .string()
    .min(2, { message: 'category.form.subtitle.error.minLength' })
    .max(100, { message: 'category.form.subtitle.error.maxLength' }),

  description: z
    .string()
    .min(10, { message: 'category.form.description.error.minLength' }),

  headerBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.headerColor.error.required' }),

  contentBackgroundColor: z
    .string()
    .min(1, { message: 'category.form.contentColor.error.required' }),

  iconImageUrl: z.union([
    z.instanceof(File),
    z.string().pipe(z.string().url()),
    z.null(),
  ]),

  backgroundImageUrl: z
    .union([z.instanceof(File), z.string().pipe(z.string().url()), z.null()])
    .refine((file) => file !== null, {
      message: 'category.form.backgroundImage.error.required',
    }),

  parentId: z.union([z.string(), z.null()]).optional(),

  isActive: z.enum(['true', 'false']),
  children: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, { message: 'category.form.name.error.minLength' })
          .max(50, { message: 'category.form.name.error.maxLength' }),

        backgroundImageUrl: z
          .union([
            z.instanceof(File),
            z.string().pipe(z.string().url()),
            z.null(),
          ])
          .refine((file) => file !== null, {
            message: 'category.form.backgroundImage.error.required',
          }),

        headerBackgroundColor: z
          .string()
          .min(1, { message: 'category.form.headerColor.error.required' })
          .nullish()
          .nullish(),

        subtitle: z
          .string()
          .min(2, { message: 'category.form.subtitle.error.minLength' })
          .max(100, { message: 'category.form.subtitle.error.maxLength' })
          .nullish(),

        description: z
          .string()
          .min(10, { message: 'category.form.description.error.minLength' })
          .nullish(),

        contentBackgroundColor: z
          .string()
          .min(1, { message: 'category.form.contentColor.error.required' })
          .nullish(),

        iconImageUrl: z.union([
          z.instanceof(File),
          z.string().pipe(z.string().url()),
          z.null(),
        ]),

        id: z.union([z.string(), z.null()]).nullish(),
        parentId: z.union([z.string(), z.null()]).nullish(),

        isActive: z.enum(['true', 'false']),
      })
    )
    .optional(),
});

export type CreateCategoryForm = z.infer<typeof categoryUploadSchema1>;

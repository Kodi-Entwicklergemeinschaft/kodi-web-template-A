import { z } from 'zod';

import { REGEX } from '@/lib/regexConstant';

export const personalInfoSchema = z
  .object({
    email: z
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
    username: z
      .string()
      .min(3, 'registration.form.username.error.minContent')
      .max(50, 'registration.form.username.error.maxContent')
      .regex(REGEX.NO_SPACES, 'registration.form.username.error.noSpaces'),
    firstName: z
      .string()
      .min(2, 'registration.form.firstName.error.minContent')
      .max(50, 'registration.form.firstName.error.maxContent')
      .regex(/^[A-Za-z]+$/, 'registration.form.firstName.error.invalidChars')
      .regex(REGEX.NO_SPACES, 'registration.form.firstName.error.noSpaces'),
    lastName: z
      .string()
      .min(2, 'registration.form.lastName.error.minContent')
      .max(50, 'registration.form.lastName.error.maxContent')
      .regex(
        REGEX.ONLY_LETTERS,
        'registration.form.lastName.error.invalidChars'
      )
      .regex(REGEX.NO_SPACES, 'registration.form.lastName.error.noSpaces'),
    // phoneNumber: z
    //   .string()
    //   .optional()
    //   .refine(
    //     (val) => !val || /^\d{10}$/.test(val),
    //     'accountSetting.form.phoneNumber.error.required'
    //   ),
    // description: z
    //   .string()
    //   .max(200, 'accountSetting.form.description.error.maxContent')
    //   .optional(),
    // website: z
    //   .string()
    //   .optional()
    //   .refine(
    //     (val) => {
    //       if (!val) return true;
    //       try {
    //         new URL(val);
    //         return true;
    //       } catch {
    //         return false;
    //       }
    //     },
    //     { message: 'accountSetting.form.websiteLink.error.invalidLink' }
    //   ),
  })
  .partial();

export type PersonalInfoFormType = z.infer<typeof personalInfoSchema>;

export const metadataItemSchema = z.object({
  id: z.number().optional(),
  name: z
    .string()
    .min(1, 'accountSetting.form.website.error.required')
    .max(50, 'accountSetting.form.website.error.maxContent'),
  link: z
    .string()
    .min(3, 'accountSetting.form.websiteLink.error.minContent')
    .max(50, 'Max length is 50') // required error
    .refine(
      (val) => {
        try {
          new URL(val);
          return true;
        } catch {
          return false;
        }
      },
      { message: 'accountSetting.form.websiteLink.error.invalidLink' }
    ),
});

export const metadataSchema = z.object({
  metadata: z.array(metadataItemSchema).superRefine((items, ctx) => {
    const linkMap = new Map<string, number[]>();
    items.forEach((item, index) => {
      if (!item.link) return;
      if (linkMap.has(item.link)) {
        linkMap.get(item.link)!.push(index);
      } else {
        linkMap.set(item.link, [index]);
      }
    });

    linkMap.forEach((indexes) => {
      if (indexes.length > 1) {
        indexes.forEach((i) => {
          ctx.addIssue({
            path: [i, 'link'],
            message: 'accountSetting.form.websiteLink.error.duplicateLink',
            code: 'custom',
          });
        });
      }
    });
    // Check duplicate names
    const nameMap = new Map<string, number[]>();
    items.forEach((item, index) => {
      if (!item.name) return;
      if (nameMap.has(item.name)) {
        nameMap.get(item.name)!.push(index);
      } else {
        nameMap.set(item.name, [index]);
      }
    });

    nameMap.forEach((indexes) => {
      if (indexes.length > 1) {
        indexes.forEach((i) => {
          ctx.addIssue({
            path: [i, 'name'],
            message: 'accountSetting.form.website.error.duplicateWebsite',
            code: 'custom',
          });
        });
      }
    });
  }),
});

export type MetaDataForm = z.infer<typeof metadataSchema>;

export const passwordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(8, 'accountSetting.form.currentPassword.error.required'),
    newPassword: z
      .string()
      .min(8, 'accountSetting.form.newPassword.error.minContent')
      .max(50, 'accountSetting.form.newPassword.error.maxContent'),
    confirmPassword: z
      .string()
      .min(8, 'accountSetting.form.confirmPassword.error.required')
      .max(50, 'accountSetting.form.confirmPassword.error.maxContent'),
  })
  .superRefine((values, ctx) => {
    if (values.newPassword !== values.confirmPassword) {
      ctx.addIssue({
        code: 'custom',
        message: 'accountSetting.form.confirmPassword.error.passwordMismatch',
        path: ['confirmPassword'], // error will be attached to confirmPassword
      });
    }
  });

export type PasswordFormType = z.infer<typeof passwordSchema>;

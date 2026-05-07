import { z } from 'zod';

import { REGEX } from '@/lib/regexConstant';

export const registerSchema = z
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
    password: z
      .string()
      .min(8, 'registration.form.password.error.minContent')
      .max(50, 'registration.form.password.error.maxContent')
      .regex(REGEX.NO_SPACES, 'registration.form.password.error.noSpaces'),
    confirmPassword: z
      .string()
      .min(1, 'registration.form.confirmPassword.error.required'),
    acceptPolicy: z.boolean(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'registration.form.confirmPassword.error.mismatch',
    path: ['confirmPassword'],
  })
  .refine((data) => data.acceptPolicy === true, {
    message: 'registration.general.mustAcceptTermsAndPrivacy',
    path: ['acceptPolicy'],
  });

export type RegisterForm = z.infer<typeof registerSchema>;

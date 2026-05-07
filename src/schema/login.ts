import { z } from 'zod';

import { REGEX } from '@/lib/regexConstant';

export const loginSchema = z.object({
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
  password: z
    .string()
    .min(8, 'registration.form.password.error.minContent')
    .max(50, 'registration.form.password.error.maxContent')
    .regex(REGEX.NO_SPACES, 'registration.form.password.error.noSpaces'),
  rememberMe: z.boolean(),
});

export type LoginForm = z.infer<typeof loginSchema>;

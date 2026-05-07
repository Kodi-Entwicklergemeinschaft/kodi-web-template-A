import z from 'zod';

export const resetPasswordSchema = z
  .object({
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

export type ResetPasswordFormType = z.infer<typeof resetPasswordSchema>;

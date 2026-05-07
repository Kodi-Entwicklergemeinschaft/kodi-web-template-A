import { z } from 'zod';

const AppConfigSchema = z.object({
  environmentMode: z.enum(['development', 'production', 'testing', 'mock']),
  browserStorageMethod: z.enum(['sessionStorage', 'localStorage']),
  apiBaseUrl: z.string().min(1, '`VITE_API_BASE_URL` is missing in `.env`'),
  primaryLightColor: z
    .string()
    .min(1, '`VITE_PRIMARY_HSL` is missing in `.env`'),
  backgroundLightColor: z
    .string()
    .min(1, '`VITE_BACKGROUND_HSL` is missing in `.env`'),
  foregroundLightColor: z
    .string()
    .min(1, '`VITE_FOREGROUND_HSL` is missing in `.env`'),
  primaryDarkColor: z
    .string()
    .min(1, '`VITE_PRIMARY_DARK_HSL` is missing in `.env`'),
  backgroundDarkColor: z
    .string()
    .min(1, '`VITE_BACKGROUND_HSL_DARK` is missing in `.env`'),
  foregroundDarkColor: z
    .string()
    .min(1, '`VITE_FOREGROUND_HSL_DARK` is missing in `.env`'),
});

export type AppConfigSchemaType = z.infer<typeof AppConfigSchema>;

const appConfig = AppConfigSchema.parse({
  environmentMode: import.meta.env
    .MODE as AppConfigSchemaType['environmentMode'],
  browserStorageMethod: import.meta.env
    .VITE_BROWSER_STORAGE_METHOD as AppConfigSchemaType['browserStorageMethod'],
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  primaryLightColor: import.meta.env.VITE_PRIMARY_HSL,
  backgroundLightColor: import.meta.env.VITE_BACKGROUND_HSL,
  foregroundLightColor: import.meta.env.VITE_FOREGROUND_HSL,
  primaryDarkColor: import.meta.env.VITE_PRIMARY_DARK_HSL,
  backgroundDarkColor: import.meta.env.VITE_BACKGROUND_HSL_DARK,
  foregroundDarkColor: import.meta.env.VITE_FOREGROUND_HSL_DARK,
} satisfies z.infer<typeof AppConfigSchema>);

export default appConfig;

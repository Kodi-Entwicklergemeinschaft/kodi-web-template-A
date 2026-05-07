/// <reference types="vite/client" />

declare global {
  interface ImportMetaEnv {
    readonly VITE_PORT: number;
    readonly VITE_API_BASE_URL: string;
    readonly VITE_PRIMARY_HSL: string;
    readonly VITE_BACKGROUND_HSL: string;
    readonly VITE_FOREGROUND_HSL: string;
    readonly VITE_PRIMARY_DARK_HSL: string;
    readonly VITE_BACKGROUND_HSL_DARK: string;
    readonly VITE_FOREGROUND_HSL_DARK: string;
  }

  interface ImportMeta {
    readonly env: ImportMetaEnv;
  }
}

export {};

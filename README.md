# mein.KODI — Admin CMS Dashboard

**mein.KODI** is a multi-language admin dashboard and content management system (CMS) built for city-level administration. It enables city administrators to manage public-facing content including categories, listings, and tiles — the building blocks of a city services application. It supports role-based access control, 10 languages, light/dark theming, and a full authentication flow including sign-in, registration, and password reset.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Project Structure](#project-structure)
- [Roles & Permissions](#roles--permissions)
- [Internationalization](#internationalization)
- [Theming](#theming)
- [Mock Mode](#mock-mode)
- [Cloudflare Worker](#cloudflare-worker)
- [Code Quality](#code-quality)
- [Contributing](#contributing)
- [Licence](#licence)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 |
| Language | TypeScript 5.5 |
| Build tool | Vite 5.4 |
| Routing | React Router v7 |
| State management | Zustand 5 |
| Data fetching | TanStack React Query v5 |
| Forms | React Hook Form 7 + Zod 4 |
| UI components | shadcn/ui (Radix UI) |
| Styling | Tailwind CSS 3.4 |
| Internationalization | i18next 25 + react-i18next 16 |
| Maps | Leaflet + react-leaflet |
| Notifications | Sonner |
| API mocking | Mock Service Worker (MSW) 2 |
| Serverless proxy | Cloudflare Workers |

---

## Prerequisites

Ensure the following are installed before proceeding:

| Tool | Minimum version |
|------|----------------|
| Node.js | `>= 24.11.0` |
| Yarn | `>= 1.22.0` |

> This project uses Yarn as its package manager. Running `npm install` is not supported — an `.npmrc` file enforces Yarn usage.

Check your versions:

```bash
node -v
yarn -v
```

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Install dependencies

```bash
yarn install
```

### 3. Set up environment variables

Copy the default env file and update the values for your environment:

```bash
cp .env .env.local
```

At minimum, set the API base URL (see [Environment Variables](#environment-variables)):

```bash
VITE_API_BASE_URL=https://your-api-server.example.com/api/
```

### 4. Start the development server

```bash
yarn dev
```

The app will be available at `http://localhost:3000`.

---

## Environment Variables

There are three env files, each loaded for a different context:

| File | When it applies |
|------|----------------|
| `.env` | Default — loaded in all modes |
| `.env.development` | Overrides `.env` when running `yarn dev` |
| `.env.production` | Overrides `.env` when running `yarn build:production` |

### Variable Reference

```bash
# ── API ────────────────────────────────────────────────────────────────
# Base URL for all API requests — must include trailing /api/
VITE_API_BASE_URL=https://example.com/api/

# ── Storage ────────────────────────────────────────────────────────────
# How the app stores session data in the browser
# Options: localStorage | sessionStorage | cookie
VITE_BROWSER_STORAGE_METHOD=localStorage

# ── Theme: Light Mode (HSL) ────────────────────────────────────────────
VITE_PRIMARY_HSL=220 9% 46%
VITE_BACKGROUND_HSL=0 0% 100%
VITE_FOREGROUND_HSL=0 0% 0%

# ── Theme: Dark Mode (HSL) ─────────────────────────────────────────────
VITE_PRIMARY_DARK_HSL=0 0% 95%
VITE_BACKGROUND_HSL_DARK=222 20% 12%
VITE_FOREGROUND_HSL_DARK=210 20% 92%
```

> All variables must be prefixed with `VITE_` to be accessible in the browser at runtime via `import.meta.env`.

### Updating the API URL

To point the app at a different backend, update `VITE_API_BASE_URL` in the relevant env file:

```bash
# .env.development
VITE_API_BASE_URL=https://your-dev-api.example.com/api/

# .env.production
VITE_API_BASE_URL=https://your-prod-api.example.com/api/
```

---

## Available Scripts

| Command | Description |
|---------|-------------|
| `yarn dev` | Start local dev server on port 3000 |
| `yarn mock` | Start dev server with MSW mock API enabled |
| `yarn production` | Start dev server in production mode |
| `yarn build:development` | TypeScript check + Vite build (development mode) |
| `yarn build:production` | TypeScript check + Vite build (production mode) |
| `yarn preview` | Preview the last build locally |
| `yarn preview:production` | Preview the production build |
| `yarn lint` | Run ESLint across all source files |
| `yarn format` | Run Prettier and auto-fix formatting |
| `yarn check:i18n` | Validate all translation files against the English base |
| `yarn gen:i18n-schema` | Validate translations and regenerate TypeScript schema |
| `yarn worker:dev` | Run Cloudflare Worker locally (Nominatim proxy) |
| `yarn worker:deploy` | Deploy Cloudflare Worker to production |

---

## Architecture

For a full visual architecture graph covering the component tree, data flow, asset structure, and i18n setup, see:

**[ARCHITECTURE.md](./ARCHITECTURE.md)**

### High-level overview

```
Browser
  └── React App (Vite)
        ├── React Router v7        — page routing & protected routes
        ├── Zustand                — global auth/user state
        ├── TanStack React Query   — server state, caching, pagination
        ├── Axios                  — HTTP client with token interceptors
        ├── i18next                — 10-language translations
        └── Tailwind CSS           — utility-first styling with HSL theming
```

### Data flow

```
Page Component
  → React Query hook        (src/api/queries/)
    → API endpoint function (src/api/endpoints/)
      → Axios instance      (src/api/apiRequest.ts)
        → Backend REST API
```

Auth tokens are stored in cookies and automatically injected into every request via Axios interceptors. On 401 responses, the interceptor attempts a token refresh before retrying.

---

## Project Structure

```
src/
├── api/              # Axios client, endpoint functions, React Query hooks
├── assets/           # Static images (kodi_logo.png)
├── components/       # shadcn/ui base components
├── config/           # App-level config: sidebar, cookies, permissions, Firebase
├── context/          # React context providers (React Query, Theme)
├── hooks/            # Custom React hooks
├── i18n.ts           # i18next setup and language registration
├── layout/           # AuthWrapper and DashboardWrapper layout shells
├── lib/              # Utility functions, storage helpers, constants
├── mocks/            # MSW mock handlers and response fixtures
├── pages/            # Feature pages (Categories, Listings, Tiles, etc.)
├── route/            # App router, protected routes, route constants
├── schema/           # Zod validation schemas for all forms
├── shared/           # Reusable UI components (FormField, Pagination, etc.)
├── store/            # Zustand global store and slices
├── translation/      # JSON translation files for all 10 languages
└── type/             # Shared TypeScript types (UserRole, SupportedLang)
```

---

## Roles & Permissions

The app implements three user roles:

| Role | Description | Can Edit | Can Delete |
|------|-------------|:--------:|:----------:|
| `SUPER_ADMIN` | Full platform access across all cities | Yes | Yes |
| `CITY_ADMIN` | Scoped to their assigned city | Yes | No |
| `CITIZEN` | Read-only, no CMS access | No | No |

Role-based rendering is handled by the `RoleBasedPermission` component in `src/shared/RoleBasedPermission/`. Permission rules are defined in `src/config/userPermission.ts`.

### Application Routes

| Route | Description | Access |
|-------|-------------|--------|
| `/login` | Sign in | Public |
| `/register` | Registration | Public |
| `/reset-password/:token` | Password reset | Public |
| `/dashboard` | Main dashboard | Authenticated |
| `/categories` | Global category management | SUPER_ADMIN |
| `/categories/city` | City-level categories | CITY_ADMIN |
| `/listings` | Listing management | Authenticated |
| `/tiles` | Tile management | Authenticated |
| `/user-management` | City admin management | SUPER_ADMIN |
| `/accounts` | Personal account settings | Authenticated |
| `/privacy` | Privacy policy | Public |
| `/terms` | Terms & conditions | Public |

---

## Internationalization

The app supports 10 languages out of the box:

| Code | Language | Fallback |
|------|----------|:-------:|
| `de` | German | Yes (default) |
| `en` | English | — |
| `ar` | Arabic | — |
| `dk` | Danish | — |
| `fa` | Farsi | — |
| `no` | Norwegian | — |
| `ru` | Russian | — |
| `se` | Swedish | — |
| `tr` | Turkish | — |
| `uk` | Ukrainian | — |

The active language is persisted in `localStorage` under the key `i18nextLng`. Users can switch language at runtime via the `LanguageSelector` component in the top navigation.

### Adding a new language

1. Create `src/translation/<code>.json` by copying `en.json` as a template
2. Translate all values — do not change the keys
3. Import the file in `src/i18n.ts` and add it to the `resources` map
4. Add the language code to `src/type/SupportedLang.ts`
5. Run `yarn check:i18n` to validate

### Validating translations

```bash
# Check all language files have the same keys as en.json
yarn check:i18n

# Regenerate the TypeScript type schema from the current translations
yarn gen:i18n-schema
```

---

## Theming

The app supports **light and dark mode** driven by CSS HSL variables, configurable via environment variables. The active theme is persisted in `localStorage` and toggled at runtime via the `ThemeSwitcher` component in the top navigation.

To customise the colour scheme, update the HSL variables in your env file:

```bash
# Light mode primary colour — HSL format (hue saturation lightness)
VITE_PRIMARY_HSL=220 9% 46%

# Dark mode background
VITE_BACKGROUND_HSL_DARK=222 20% 12%
```

Theme variables are consumed in `src/index.css` and applied globally via Tailwind CSS custom properties.

---

## Mock Mode

Mock mode intercepts all API calls using **Mock Service Worker (MSW)** and returns fixture data — no backend required.

```bash
yarn mock
```

Mock handlers are defined in `src/mocks/handlers.ts`. Response fixtures live in `src/mocks/responses/`. Mock mode activates when `import.meta.env.MODE === 'mock'`.

Useful for:
- Frontend development without a running backend
- Demoing the app in isolation
- Testing UI flows with controlled, predictable data

---

## Cloudflare Worker

A lightweight Cloudflare Worker in `worker/worker.ts` acts as a proxy for the **Nominatim geocoding API** used by the location picker map. This avoids CORS issues and browser-side rate-limit attribution.

```bash
# Run the worker locally
yarn worker:dev

# Deploy to Cloudflare
yarn worker:deploy
```

Configuration is in `wrangler.toml`.

---

## Code Quality

### Linting

```bash
yarn lint
```

ESLint is configured in `eslint.config.js` with React and TypeScript rules.

### Formatting

```bash
yarn format
```

Prettier is configured in `prettier.config.cjs`. It runs automatically on staged files via a Husky pre-commit hook — no manual step required on commit.

### Pre-commit hooks

Husky runs `lint-staged` before every commit, which automatically:
- Formats staged `.ts` / `.tsx` files with Prettier
- Lints staged files with ESLint

If the hook fails, fix the reported issues and re-commit. Do not bypass hooks with `--no-verify`.

---

## Contributing

1. Create a feature branch from `main`
2. Install dependencies with `yarn install`
3. Make your changes
4. Run `yarn lint` and `yarn build:production` to verify nothing is broken
5. If you touched any `translation/*.json` file, run `yarn check:i18n`
6. Open a pull request against `main`

---

## Licence

This project is licensed under the **European Union Public Licence v. 1.2 (EUPL-1.2)**.

See the [LICENSE](./LICENSE) file for the full licence text.

> EUPL is a copyleft licence approved by the European Commission. It is compatible with GPL v2/v3, AGPL v3, MPL v2, LGPL v2.1/v3, and several other open source licences listed in the licence appendix.
>
> Official licence information: https://joinup.ec.europa.eu/collection/eupl/eupl-text-eupl-12

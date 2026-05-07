# KODI-public — Architecture Overview

## Codebase Architecture Graph

```
┌─────────────────────────────────────────────────────────────────────┐
│                              root                                    │
│              React 18 · TypeScript · Vite · Tailwind CSS            │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
         ┌─────────────────────┼─────────────────────┐
         ▼                     ▼                     ▼
  ┌─────────────┐      ┌──────────────┐      ┌─────────────┐
  │  index.html │      │   main.tsx   │      │  index.css  │
  │  (favicon:  │      │ (React entry)│      │  (Tailwind  │
  │ kodi_logo   │      └──────┬───────┘      │   globals)  │
  │   .png)     │             │              └─────────────┘
  └─────────────┘             ▼
                       ┌──────────────┐
                       │   App.tsx    │
                       │ (root mount) │
                       └──────┬───────┘
                              │
            ┌─────────────────┼──────────────────┐
            ▼                 ▼                  ▼
   ┌─────────────────┐ ┌────────────┐   ┌────────────────┐
   │  context/       │ │  store/    │   │   route/       │
   │  ReactQuery     │ │  Zustand   │   │   AppRoutes    │
   │  ThemeProvider  │ │  userSlice │   │   (RR v7)      │
   └─────────────────┘ └────────────┘   └──────┬─────────┘
                                               │
                   ┌───────────────────────────┤
                   │                           │
                   ▼                           ▼
          ┌─────────────────┐        ┌─────────────────┐
          │  layout/        │        │  pages/         │
          │  AuthWrapper    │        │  (16 modules,   │
          │  Dashboard      │        │   71 files)     │
          │  Wrapper        │        └────────┬────────┘
          │  (kodi_logo.png)│                 │
          └─────────────────┘     ┌───────────┼───────────┐
                                  ▼           ▼           ▼
                           ┌──────────┐ ┌──────────┐ ┌───────────┐
                           │SignIn    │ │Dashboard │ │Categories │
                           │SignUp    │ │Account   │ │Listings   │
                           │Register  │ │CityAdmin │ │Tiles      │
                           └──────────┘ └──────────┘ └───────────┘
                                  │           │           │
                                  └───────────┴───────────┘
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                       ┌────────────┐ ┌────────────┐ ┌────────────┐
                       │  shared/   │ │   api/     │ │  schema/   │
                       │  (37 files)│ │  (36 files)│ │  (Zod,     │
                       │  FormField │ │  endpoints │ │   7 files) │
                       │  Layout    │ │  queries   │ └────────────┘
                       │  UI Comps  │ │  axios     │
                       └────────────┘ └─────┬──────┘
                                            │
                              ┌─────────────┼─────────────┐
                              ▼             ▼             ▼
                        ┌──────────┐ ┌──────────┐ ┌──────────┐
                        │  lib/    │ │  hooks/  │ │  config/ │
                        │  utils   │ │  5 files │ │  6 files │
                        │  storage │ │  useLoad │ │  appCfg  │
                        │  9 files │ │  Theme   │ │  sidebar │
                        └──────────┘ │  Mobile  │ │  perms   │
                                     └──────────┘ └──────────┘
```

---

## Assets & Images

```
┌─────────────────────────────────────────────────────────────────────┐
│                     ASSETS & IMAGES                                 │
├───────────────────────────┬─────────────────────────────────────────┤
│  src/assets/              │  public/                                │
│  ├── kodi_logo.png ◄──┐   │  ├── kodi_logo.png (favicon source)    │
│  └── react.svg        │   │  ├── vite.svg                          │
│                        │   │  └── mockServiceWorker.js             │
│  Used in:              │   │                                        │
│  ├── AuthWrapper.tsx ──┘   │  Referenced in:                        │
│  └── DashboardWrapper.tsx  │  └── index.html (favicon <link>)       │
└───────────────────────────┴─────────────────────────────────────────┘
```

---

## Internationalization (i18n)

```
┌─────────────────────────────────────────────────────────────────────┐
│                  INTERNATIONALIZATION (i18n)                        │
├─────────────────────────────────────────────────────────────────────┤
│  src/i18n.ts ─────────────► translation/                           │
│                               ├── en.json  (711 lines, base)       │
│                               ├── de.json  (German, fallback)       │
│                               ├── ar.json  (Arabic)                │
│                               ├── dk.json  (Danish)                │
│                               ├── fa.json  (Farsi)                 │
│                               ├── no.json  (Norwegian)             │
│                               ├── ru.json  (Russian)               │
│                               ├── se.json  (Swedish)               │
│                               ├── tr.json  (Turkish)               │
│                               └── uk.json  (Ukrainian)             │
│  scripts/                                                           │
│  ├── validate-translations.js  (checks keys match en.json)         │
│  └── generate-translation-schema.js  (auto-generates types)        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                     DATA FLOW                                       │
├─────────────────────────────────────────────────────────────────────┤
│  Component → React Query hook → API endpoint → Axios → Backend     │
│  Zustand store ← Auth/User state → localStorage (cookies)          │
│  MSW (mock mode) → intercepts Axios → mock response handlers       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Action Plan

### 1. Search Functionality Across Complete Code

| Step | Action | Files to touch |
|------|--------|----------------|
| 1 | Decide scope — global search (all content types) or scoped per-page? | Design decision |
| 2 | Create a search API endpoint wrapper in `src/api/endpoints/` | New file `search.ts` |
| 3 | Add a React Query hook for it | New file `src/api/queries/useSearch.ts` |
| 4 | Build a `GlobalSearch` shared component with debounced input | `src/shared/GlobalSearch/` |
| 5 | Wire it into the `Header.tsx` in `src/shared/DashboardLayout/` | `Header.tsx` |
| 6 | Add i18n keys for search labels in all 10 `translation/*.json` files | 10 JSON files |
| 7 | Add route for search results page if needed | `src/route/routesConstant.ts` |

---

### 2. Create README.md

| Section | Content source |
|---------|----------------|
| Project overview | `package.json` → name `kodi-web-app`, description |
| Tech stack table | React 18, Vite, TypeScript, Tailwind, Zustand, React Query, i18next, MSW |
| Directory structure | The `src/` tree above |
| Environment variables | `.env`, `.env.development`, `.env.production` keys |
| How to run locally | `yarn dev`, `yarn mock`, `yarn worker:dev` |
| How to build | `yarn build:production` |
| i18n / translations | How to add a language, run `yarn check:i18n` |
| Role-based access | Roles from `src/type/UserRole.ts`, permissions from `src/config/userPermission.ts` |
| Asset conventions | Where logos live (`src/assets/`, `public/`) |
| Contributing guide | Linting, Prettier, Husky pre-commit hooks |

---

### 3. Swap a Complete Word into Another

| Location | File types | Risk level |
|----------|-----------|------------|
| Component/page names | `*.tsx`, `*.ts` | High — affects imports |
| Variable/function names | `*.tsx`, `*.ts` | High — affects all call sites |
| Translation keys | `translation/*.json` | High — must update all 10 files |
| Translation values (visible text) | `translation/*.json` | Medium |
| API endpoint strings | `src/api/apiURl.ts` | Medium |
| Config strings | `src/config/`, `src/lib/constant.ts` | Medium |
| CSS class names | `*.tsx`, `index.css` | Low |
| Comments | `*.ts`, `*.tsx` | Low |
| `index.html` title/meta | `index.html` | Low |
| `wrangler.toml`, env files | Config files | Low |

**Steps:**

| Step | Action |
|------|--------|
| 1 | Confirm exact word (case-sensitive? camelCase variants? e.g., `KODI`, `kodi`, `KODI`) |
| 2 | Run a grep across all files to see every occurrence and its context |
| 3 | Group occurrences: code identifiers vs. display strings vs. config values |
| 4 | Replace display strings first (translation JSONs) — lowest risk |
| 5 | Replace config/constant strings |
| 6 | Replace code identifiers (may require renaming files and updating all imports) |
| 7 | Run `yarn lint` and `yarn check:i18n` to verify nothing broke |
| 8 | Run `yarn build:production` to confirm TypeScript compile passes |

---

### 4. Exchange Image References from Assets and File Naming

**Current image inventory:**

| File | Location | Referenced by |
|------|----------|--------------|
| `kodi_logo.png` | `src/assets/` | `AuthWrapper.tsx` (import), `DashboardWrapper.tsx` (import) |
| `kodi_logo.png` | `public/` | `index.html` (favicon `<link>`) |
| `react.svg` | `src/assets/` | Not referenced (leftover Vite template file) |
| `vite.svg` | `public/` | Not referenced (leftover Vite template file) |

**Steps:**

| Step | Action | Files affected |
|------|--------|----------------|
| 1 | Decide new image filename(s) and new logical variable name | Design decision |
| 2 | Add new image file to `src/assets/` | `src/assets/new_name.png` |
| 3 | Update import in `AuthWrapper.tsx` — change path and variable name | `src/layout/AuthWrapper.tsx` |
| 4 | Update import in `DashboardWrapper.tsx` — change path and variable name | `src/layout/DashboardWrapper.tsx` |
| 5 | Replace old image in `public/` with new one (same or new filename) | `public/new_name.png` |
| 6 | Update `index.html` favicon `<link href>` to new public filename | `index.html` |
| 7 | Delete old files after confirming no remaining references | Cleanup |
| 8 | Run grep to confirm zero remaining references to old filenames | Verification |

---

## Task Priority Summary

| # | Task | Affected file count | Risk | Recommended order |
|---|------|--------------------:|------|:-----------------:|
| 4 | Image reference swap | ~6 files | Low | 1st |
| 2 | README.md creation | 1 file (new) | None | 2nd |
| 3 | Word swap | Up to 100+ files | High | 3rd |
| 1 | Search functionality | 10–15 new/modified | Medium | 4th |

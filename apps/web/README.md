# Analogue Archive — Film Diary

A minimal, atmospheric digital diary for film photographers.  
Built with React 18 + TypeScript + Vite + SCSS Modules.

---

## Quick start

```bash
npm install
npm run dev
```

---

## Dependencies

### Runtime (`dependencies`)

| Package | Why |
|---------|-----|
| `react` `react-dom` | UI framework |
| `react-router-dom` | Client-side URL routing (v6) |

No external UI libraries — all components are hand-built.

### Dev / build (`devDependencies`)

| Package | Why |
|---------|-----|
| `vite` | Build tool & dev server (HMR) |
| `@vitejs/plugin-react` | Fast Refresh for React |
| `typescript` | Static typing |
| `sass` | Dart Sass — Vite подхватывает `.scss` автоматически |
| `@types/react` `@types/react-dom` | React TypeScript types |
| `eslint` + plugins | Linting (optional) |

> `react-router-dom` v6 поставляется со встроенными TypeScript-типами —  
> отдельный `@types/react-router-dom` не нужен.

---

## Роутинг

| URL | Компонент |
|-----|-----------|
| `/` | `HomePage` |
| `/film/:filmId` | `GalleryView` |
| `*` | редирект на `/` |

`filmId` в URL совпадает с полем `id` в `FILM_CATEGORIES` (например `kodak-gold`).  
`GalleryView` читает его через `useParams<{ filmId: string }>()`,  
ищет плёнку в массиве и делает `navigate('/', { replace: true })` если не нашёл.

Кнопка «← BACK» в шапке галереи вызывает `navigate('/')` — работает  
и как обычная ссылка, и как браузерная кнопка «назад».

**Деплой на статический хостинг** — нужно настроить fallback на `index.html`  
для всех путей (Netlify: `_redirects`, Vercel: `vercel.json`, Nginx: `try_files`).

## Project structure

```
src/
├── types/
│   └── index.ts               # FilmCategory, Photo interfaces
│
├── data/
│   └── films.ts               # FILM_CATEGORIES array + generateMockPhotos()
│
├── hooks/
│   ├── useIntersectionObserver.ts  # Lazy-load trigger for images
│   └── useKeyboard.ts              # Keyboard shortcuts (lightbox arrows / Esc)
│
├── styles/
│   ├── _variables.scss        # Fonts, colors, spacing, breakpoints, mixins, keyframes
│   └── global.scss            # CSS reset + base body styles
│
├── components/
│   ├── SkeletonCard/          # Shimmer placeholder while images load
│   ├── FilmStrip/             # Decorative 35mm sprocket-hole strip
│   ├── PhotoCard/             # Single photo tile with hover lift effect
│   ├── Lightbox/              # Full-screen viewer with arrow navigation
│   ├── FilmCard/              # Film roll category card (homepage)
│   ├── GalleryView/           # Gallery page: header + photo grid + lightbox
│   └── HomePage/              # Landing page: hero + stats + film grid
│
├── App.tsx                    # Root — toggles between HomePage and GalleryView
└── main.tsx                   # ReactDOM.createRoot entry point
```

Each component folder follows the pattern:
```
ComponentName/
├── ComponentName.tsx          # Component logic
├── ComponentName.module.scss  # Scoped styles (SCSS modules)
└── index.ts                   # Barrel export
```

---

## SCSS architecture

All shared tokens live in `src/styles/_variables.scss` and are imported  
at the top of every module via `@use '../../styles/variables' as *;`.

Available mixins:

```scss
@include mono($size, $spacing)    // DM Mono + letter-spacing
@include display($size)           // Playfair Display
@include italic-body($size)       // Cormorant Garamond italic
@include shimmer-bg               // Animated loading gradient
@include mobile                   // max-width: 600px media query
@include tablet                   // max-width: 960px media query
```

Dynamic per-component colors (accent, card background) are passed  
as CSS custom properties via inline `style` props and consumed in SCSS  
with `var(--accent)` etc. This avoids string interpolation in SCSS  
while keeping full TypeScript type safety on the component API.

---

## Replacing mock photos

`generateMockPhotos()` in `src/data/films.ts` builds placeholder URLs  
from `picsum.photos`. To use real photos, replace it with your own  
data source — the `Photo` interface is the only contract:

```ts
interface Photo {
  id:      string;
  url:     string;   // full-size (lightbox)
  thumb:   string;   // thumbnail (grid)
  width:   number;
  height:  number;
  frame:   string;   // e.g. "01"
  keyword: string;   // optional tag
}
```

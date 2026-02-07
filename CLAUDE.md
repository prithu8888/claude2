# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — Start Vite dev server with HMR
- `npm run build` — TypeScript compile + Vite production build
- `npm run lint` — ESLint across all .ts/.tsx files
- `npm run preview` — Preview production build locally

## Tech Stack

React 19 + TypeScript (strict mode) + Vite 7. Plain CSS for styling (no framework/preprocessor). No external state management library — all state lives in React hooks.

## Architecture

Single-page movie selector app. Users filter movies by genre, mood, year range, language, and actor.

**Component tree:**
- `App` — owns all state (`filters`, `selectedMovie`), computes `filteredMovies` via `useMemo`
  - `FilterPanel` — sidebar filter controls, receives movies + filters + setter
  - `MovieGrid` → `MovieCard[]` — displays filtered results
  - `MovieDetail` — modal shown when a movie card is clicked

**Data flow:** App holds filter state → passes down to FilterPanel for controls and to MovieGrid for display. Filter options are dynamically extracted from the movie dataset.

**Key files:**
- `src/types/movie.ts` — `Movie` and `Filters` type definitions
- `src/data/movies.ts` — hardcoded movie dataset (the app's "database")
- Each component has a co-located `.css` file

## Style Conventions

- Dark theme (#0f0f23 background, #eee text)
- Responsive layout with 768px breakpoint
- ESLint flat config (ESLint 9) with typescript-eslint, react-hooks, and react-refresh plugins
- TypeScript strict mode with `noUnusedLocals` and `noUnusedParameters` enabled

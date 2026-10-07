# Ivory's City

My portfolio, built as a walkable brick world. Each building is a section of the
portfolio: walk up to one and step inside.

## Stack

- **React 18 + TypeScript**, bundled with **Vite**
- **Three.js** through **React Three Fiber** (declarative 3D in React) and **drei** helpers
- **Zustand** for app state (nearby building, open panel, zoom)

## Run it

```bash
npm install
npm run dev        # local dev server with hot reload
npm run build      # type-check, then build to dist/
npm run preview    # serve the production build locally
```

## Editing your content

All the words on the site live in two files, so you never need to touch the 3D code to update them:

- `src/data/portfolio.ts`: welcome text, roles, projects, skills, events, and your clubs and community work
- `src/data/buildings.ts`: each building's name, directory description and position

## Project layout

```
public/            resume PDF and arcade art (sprites, items, Uplift design)
src/
  data/            content and layout: portfolio.ts, buildings.ts, roads.ts, placement.ts
  lib/             pure helpers: taxi routing, day/night maths, asset URLs
  state/           Zustand store
  hooks/           keyboard input
  ui/              HTML overlay: HUD, minimap, quick view, building panels, arcade game
  world/
    bricks/        the brick system: BrickSet (data), BrickModel (renderer + build-up intro), walls
    buildings/
      builders/    one pure function per building, returning its bricks
      extras/      the non-brick bits: signs, animation, the plane, the crane
    scenery/       baseplate, streets, trees, lamps, flowers
    Character.tsx, Taxi.tsx, CameraRig.tsx, Environment.tsx (day/night), World.tsx
```

## How buildings work

A building is a pure function that returns a `BrickSet`: a list of bricks, studs
and collision boxes in stud units, with the front facing +z. `<BrickModel>` renders
any set, drawing all studs of one colour as a single instanced mesh, and plays the
brick-by-brick intro on first load.

To add a building:

1. Add it to `src/data/buildings.ts`: position (`origin`), which way it faces, its
   door (`entrance`), an outline for the minimap (`footprint`) and a taxi stop.
2. If it needs a new taxi stop, add a node and edge in `src/data/roads.ts` (and a
   road tile if it needs a new street).
3. Write `src/world/buildings/builders/yourBuilding.ts` and register it in
   `builders/index.ts`. Signs or animation go in `extras/` and `extras/index.ts`.
4. Add a panel in `src/ui/panels/` and register it in `src/ui/panels/index.ts`.

Trees and flowers automatically stay off streets and building plots.

## Quick view

Visiting the site with `#quick` on the end of the URL opens the one-page resume
directly, which is handy to paste into applications. It is also what shows on
devices without 3D graphics.

## Deploy

`npm run build` produces a static `dist/` folder that runs on any static host:

- **Vercel or Netlify**: import the GitHub repo; framework preset "Vite". Every push redeploys.
- **tiiny.host**: zip the contents of `dist/` and upload the zip.

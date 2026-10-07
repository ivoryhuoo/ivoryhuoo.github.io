/** URL for a file in /public, respecting Vite's base path. */
export const asset = (path: string): string => `${import.meta.env.BASE_URL}${path}`;

/** Arcade art (sprites and items) lives in /public/arcade. */
export const arcadeArt = (name: string): string => asset(`arcade/${name}.png`);

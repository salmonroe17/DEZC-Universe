/** Owner configuration. Change activeTheme here to publish one theme to the entire portfolio. */
export const portfolioTheme: { activeTheme: ThemeId } = { activeTheme: 'grey' }

export type ThemeId = 'grey' | 'cyan' | 'magenta' | 'blue' | 'light'
export type ThemePalette = Record<string, string>

export const themePalettes: Record<ThemeId, ThemePalette> = {
  grey: { bg: '#101010', surface: '#0a0a0a', elevated: '#141414', border: '#27272a', fg: '#fafafa', 'fg-muted': '#a1a1aa', 'fg-subtle': '#888891', hud: '#ffffff', 'cell-border': '#414141', 'cell-hover': '#ffffff' },
  cyan: { bg: '#0b1312', surface: '#0e1715', elevated: '#152320', border: '#2a5850', fg: '#dffaf6', 'fg-muted': '#78c9b8', 'fg-subtle': '#69ae9f', hud: '#3cdbcb', 'cell-border': '#335f56', 'cell-hover': '#6ae8d4' },
  magenta: { bg: '#100a12', surface: '#140d16', elevated: '#1c1220', border: '#4a2a52', fg: '#ffe8ff', 'fg-muted': '#c896d4', 'fg-subtle': '#b184bd', hud: '#e879f9', 'cell-border': '#553060', 'cell-hover': '#f0a8ff' },
  blue: { bg: '#0a0e16', surface: '#0c1220', elevated: '#121a2e', border: '#243a5c', fg: '#e8f0ff', 'fg-muted': '#8aa8e0', 'fg-subtle': '#829bce', hud: '#6eb0ff', 'cell-border': '#30456e', 'cell-hover': '#8cc4ff' },
  light: { bg: '#ffffff', surface: '#f4f4f5', elevated: '#fafafa', border: '#d4d4d8', fg: '#09090b', 'fg-muted': '#52525b', 'fg-subtle': '#63636c', hud: '#18181b', 'cell-border': '#a1a1aa', 'cell-hover': '#18181b' },
}

/** Paired surfaces stay together. Brand artwork and photos retain their original colors. */
export const fixedColors: ThemePalette = {
  'media-paper': '#ffffff', 'on-media-paper': '#000000', 'media-cream': '#f9f6f0',
  'media-warm': '#d9d5cf', 'media-highlight': '#eaeaea', 'media-dark': '#0a0a0a',
  'scrim': '#000000', 'on-scrim': '#ffffff', 'effect-cyan': '#00fff2', 'effect-magenta': '#ff00aa',
}

export const themeLabels: Record<ThemeId, string> = { grey: 'Original', cyan: 'Turquoise', magenta: 'Magenta', blue: 'Blue', light: 'Light · validation' }

const neonGlyphColors = ['#ff2d95', '#00ffc8', '#ffd000', '#6eb0ff', '#e879f9', '#3cdbcb', '#ff2d95']
export const themeGlyphColors: Record<ThemeId, string[]> = {
  grey: neonGlyphColors, cyan: neonGlyphColors, magenta: neonGlyphColors, blue: neonGlyphColors,
  light: ['#a30055', '#00735e', '#806300', '#2057a3', '#82319b', '#006f64', '#a30055'],
}

export function themeVariables(id: ThemeId): Record<string, string> {
  return Object.fromEntries(Object.entries({ ...fixedColors, ...themePalettes[id] }).map(([key, value]) => [`--color-${key}`, value]))
}

export function isThemeId(value: string | null): value is ThemeId {
  return value !== null && Object.hasOwn(themePalettes, value)
}

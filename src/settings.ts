export type ThemeMode = "light" | "dark" | "system" | "";
export type ThemeType = string;

// Special value to represent Obsidian's default theme
export const OBSIDIAN_DEFAULT_THEME = "__obsidian_default__";

export interface FolderThemeMapping {
    name: string;
    folder: string;
    theme: ThemeType;
    mode: ThemeMode;
}

export interface FolderThemeSettings {
    mappings: FolderThemeMapping[];
    defaultTheme: ThemeType;
    defaultMode: ThemeMode;
}

export const DEFAULT_SETTINGS: FolderThemeSettings = {
    mappings: [],
    defaultTheme: "",
    defaultMode: "",
};

export function getEffectiveValue(value: string, fallback: string): string {
    const trimmed = value.trim();
    if (trimmed) return trimmed;

    const fallbackTrimmed = fallback.trim();
    if (fallbackTrimmed) return fallbackTrimmed;

    return "";
}

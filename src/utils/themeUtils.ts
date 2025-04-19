import { App } from "obsidian";

export interface CustomCss {
    themes: Record<string, unknown>;
}

export function getAvailableThemes(app: App): string[] {
    try {
        const customCss = app.customCss;
        return Object.keys(customCss.themes);
    } catch {
        return [];
    }
}

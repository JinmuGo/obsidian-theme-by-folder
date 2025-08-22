import { App } from "obsidian";
import { ThemeType } from "../settings";

export interface CustomCss {
    themes: Record<string, unknown>;
}

export function getAvailableThemes(app: App): ThemeType[] {
    try {
        const customCss = app.customCss;
        return Object.keys(customCss.themes);
    } catch {
        return [];
    }
}

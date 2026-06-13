import { Plugin, TFile, normalizePath, Notice } from "obsidian";

import FolderThemeSettingTab from "./ui/SettingTab";
import {
    FolderThemeSettings,
    DEFAULT_SETTINGS,
    ThemeMode,
    getEffectiveValue,
    ThemeType,
    OBSIDIAN_DEFAULT_THEME,
} from "./settings";

declare module "obsidian" {
    interface App {
        customCss: {
            setTheme(theme: string): void;
            theme: string;
            themes: Record<string, unknown>;
        };
    }
}

export default class FolderThemePlugin extends Plugin {
    settings: FolderThemeSettings = DEFAULT_SETTINGS;
    userTheme: string | null = null; // To store user's global theme

    async onload() {
        await this.loadSettings();

        this.app.workspace.onLayoutReady(() => {
            this.userTheme = this.app.customCss.theme;
        });

        this.addSettingTab(new FolderThemeSettingTab(this.app, this));
        this.registerEvent(this.app.workspace.on("file-open", (file) => this.handleFileOpen(file)));
    }

    onunload() {
        // Revert to the original theme when the plugin is disabled
        if (this.userTheme !== null) {
            this.app.customCss.setTheme(this.userTheme);
        }
    }

    private handleFileOpen(file: TFile | null) {
        if (!file) return;
        const path = normalizePath(file.path);
        const mapping = this.pickMappingForPath(path);
        if (!mapping) return;

        this.applyThemeAndMode(mapping);
    }

    private pickMappingForPath(path: string): { theme: ThemeType; mode: ThemeMode } | null {
        const match = this.settings.mappings
            .filter((m) => path.startsWith(normalizePath(m.folder) + "/"))
            .sort((a, b) => b.folder.length - a.folder.length)[0];

        if (match) {
            return {
                theme: getEffectiveValue(match.theme, this.settings.defaultTheme),
                mode: getEffectiveValue(match.mode, this.settings.defaultMode) as ThemeMode,
            };
        }

        return {
            theme: this.settings.defaultTheme,
            mode: this.settings.defaultMode,
        };
    }

    private applyThemeAndMode(mapping: { theme: ThemeType; mode: ThemeMode }) {
        try {
            const themeToApply = mapping.theme;

            if (themeToApply === "") {
                // "Keep Current Theme" - do nothing, preserve whatever theme is currently active
            } else if (themeToApply === OBSIDIAN_DEFAULT_THEME) {
                // Apply Obsidian default theme by setting empty string
                if (this.app.customCss.theme !== "") {
                    this.app.customCss.setTheme("");
                }
            } else if (this.app.customCss.theme !== themeToApply) {
                this.app.customCss.setTheme(themeToApply);
            }

            // Apply mode if specified
            if (mapping.mode && mapping.mode !== "system") {
                this.applyMode(mapping.mode);
            }

            // Show notification
            if (this.settings.showNotifications) {
                let themeText = "";
                if (themeToApply === "") {
                    // No theme notification for "Keep Current Theme"
                    themeText = "";
                } else if (themeToApply === OBSIDIAN_DEFAULT_THEME) {
                    themeText = 'Theme "Obsidian Default"';
                } else if (themeToApply) {
                    themeText = `Theme "${themeToApply}"`;
                }

                const modeText = mapping.mode && mapping.mode !== "system" ? `Mode "${mapping.mode}"` : "";
                const combinedText = [themeText, modeText].filter(Boolean).join(" and ");

                if (combinedText) {
                    new Notice(`${combinedText} applied.`);
                }
            }
        } catch (e) {
            console.error(e);
            new Notice("❌ Failed to apply theme or mode");
        }
    }

    private applyMode(mode: ThemeMode) {
        const body = activeDocument.body;
        const isDark = body.classList.contains("theme-dark");

        if (mode === "dark" && !isDark) {
            body.classList.remove("theme-light");
            body.classList.add("theme-dark");
        } else if (mode === "light" && isDark) {
            body.classList.remove("theme-dark");
            body.classList.add("theme-light");
        }
    }

    async loadSettings() {
        const data = (await this.loadData()) as Partial<FolderThemeSettings>;
        this.settings = Object.assign({}, DEFAULT_SETTINGS, data);
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

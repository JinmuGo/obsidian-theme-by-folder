import { Plugin, TFile, normalizePath, Notice } from "obsidian";

import FolderThemeSettingTab from "./ui/SettingTab";
import { FolderThemeSettings, DEFAULT_SETTINGS, ThemeMode, getEffectiveValue, ThemeType } from "./settings";

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

    async onload() {
        await this.loadSettings();
        this.addSettingTab(new FolderThemeSettingTab(this.app, this));
        this.registerEvent(this.app.workspace.on("file-open", (file) => this.handleFileOpen(file)));
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
            // Apply theme if specified
            if (mapping.theme) {
                const currentTheme = this.app.customCss.theme;
                if (currentTheme !== mapping.theme) {
                    this.app.customCss.setTheme(mapping.theme);
                }
            }

            // Apply mode if specified
            if (mapping.mode && mapping.mode !== "system") {
                this.applyMode(mapping.mode as ThemeMode);
            }

            // Show notification
            const themeText = mapping.theme ? `Theme "${mapping.theme}"` : "";
            const modeText = mapping.mode && mapping.mode !== "system" ? `Mode "${mapping.mode}"` : "";
            const combinedText = [themeText, modeText].filter(Boolean).join(" and ");

            if (combinedText) {
                new Notice(`${combinedText} applied.`);
            }
        } catch (e) {
            console.error(e);
            new Notice("❌ Failed to apply theme or mode");
        }
    }

    private applyMode(mode: ThemeMode) {
        const body = document.body;
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

import { Plugin, TFile, normalizePath, Notice } from "obsidian";

import FolderThemeSettingTab from "./ui/SettingTab";
import { FolderThemeSettings, DEFAULT_SETTINGS } from "./settings";

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
        const theme = this.pickThemeForPath(path);
        if (!theme) return;

        const current = this.app.customCss.theme;
        if (current === theme) {
            return;
        }
        this.applyTheme(theme);
    }

    private pickThemeForPath(path: string): string | null {
        const match = this.settings.mappings
            .filter((m) => path.startsWith(normalizePath(m.folder) + "/"))
            .sort((a, b) => b.folder.length - a.folder.length)[0];
        return match?.theme || this.settings.defaultTheme || null;
    }

    private applyTheme(theme: string) {
        try {
            this.app.customCss.setTheme(theme);
            new Notice(`Theme "${theme}" applied`);
        } catch (e) {
            console.error(e);
            new Notice("❌ Failed to apply theme");
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

import { Setting } from "obsidian";
import FolderThemePlugin from "../main";

export function renderAddMapping(container: HTMLElement, plugin: FolderThemePlugin, refresh: () => void) {
    new Setting(container).setName("Add new mapping").addButton((b) =>
        b.setButtonText("Add Mapping").onClick(async () => {
            const idx = plugin.settings.mappings.length + 1;
            plugin.settings.mappings.push({ name: `Mapping ${idx}`, folder: "", theme: "" });
            await plugin.saveSettings();
            refresh();
        }),
    );
}

export function renderDefaultTheme(container: HTMLElement, plugin: FolderThemePlugin, _refresh: () => void) {
    new Setting(container).setName("Default theme (fallback)").addDropdown((drop) => {
        drop.addOption("", "— keep current —");
        const themes = [];
        try {
            const customCss = plugin.app.customCss;
            if (customCss?.themes) {
                themes.push(...Object.keys(customCss.themes));
            }
        } catch {
            console.error("Failed to get themes from customCss");
        }
        themes.forEach((t) => void drop.addOption(t, t));
        drop.setValue(plugin.settings.defaultTheme).onChange(async (v) => {
            plugin.settings.defaultTheme = v;
            await plugin.saveSettings();
        });
    });
}

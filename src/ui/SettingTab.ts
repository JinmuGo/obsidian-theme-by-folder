import { PluginSettingTab, App, Setting } from "obsidian";
import FolderThemePlugin from "../main";
import { FolderThemeMapping, ThemeMode } from "../settings";
import { getAvailableThemes } from "../utils/themeUtils";
import { FolderSuggest } from "./FolderSuggest";

const renderMappingRow = (
    container: HTMLElement,
    map: FolderThemeMapping,
    idx: number,
    editingIndex: number | null,
    setEditingIndex: (i: number | null) => void,
    plugin: FolderThemePlugin,
    refresh: () => void,
) => {
    const setting = new Setting(container);

    // Name: display or edit mode
    if (editingIndex === idx) {
        setting
            .setName("")
            .addText((text) => {
                const inp = text.setValue(map.name).onChange((v) => {
                    map.name = v;
                });
                setTimeout(() => inp.inputEl.focus(), 50);
                inp.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        setEditingIndex(null);
                        void plugin.saveSettings();
                        refresh();
                    } else if (e.key === "Escape") {
                        setEditingIndex(null);
                        refresh();
                    }
                });
                return inp;
            })
            .addButton((b) =>
                b
                    .setIcon("check")
                    .setTooltip("Save name")
                    .onClick(() => {
                        setEditingIndex(null);
                        void plugin.saveSettings();
                        refresh();
                    }),
            );
    } else {
        setting.setName(map.name || `Mapping ${idx + 1}`).addButton((b) =>
            b
                .setIcon("pencil")
                .setTooltip("Edit name")
                .onClick(() => {
                    setEditingIndex(idx);
                    refresh();
                }),
        );
    }

    // Folder path input with suggest and auto-save
    setting
        .addText((text) => {
            const inp = text
                .setPlaceholder("Folder path")
                .setValue(map.folder)
                .onChange(async (v) => {
                    map.folder = v;
                    await plugin.saveSettings();
                });

            new FolderSuggest(inp.inputEl, plugin.app.vault, plugin.app, (value: string) => {
                map.folder = value;
                void plugin.saveSettings();
                refresh();
            });

            return inp;
        })

        // Theme dropdown
        .addDropdown((drop) => {
            drop.addOption("", "Keep Current Theme");
            getAvailableThemes(plugin.app).forEach((t) => void drop.addOption(t, t));
            drop.setValue(map.theme).onChange(async (v) => {
                map.theme = v;
                await plugin.saveSettings();
            });
        })

        // Mode dropdown
        .addDropdown((drop) => {
            drop.addOption("", "Keep Current Mode");
            drop.addOption("light", "Light Mode");
            drop.addOption("dark", "Dark Mode");
            drop.addOption("system", "System Default");
            drop.setValue(map.mode).onChange(async (v) => {
                map.mode = v as ThemeMode;
                await plugin.saveSettings();
            });
        })

        // Delete mapping
        .addExtraButton((btn) =>
            btn
                .setIcon("trash")
                .setTooltip("Remove mapping")
                .onClick(async () => {
                    plugin.settings.mappings.splice(idx, 1);
                    await plugin.saveSettings();
                    refresh();
                }),
        );
};

const renderAddMapping = (container: HTMLElement, plugin: FolderThemePlugin, refresh: () => void) => {
    new Setting(container).setName("Add new mapping").addButton((b) =>
        b.setButtonText("Add mapping").onClick(async () => {
            const idx = plugin.settings.mappings.length + 1;
            plugin.settings.mappings.push({ name: `Mapping ${idx}`, folder: "", theme: "", mode: "" });
            await plugin.saveSettings();
            refresh();
        }),
    );
};

const renderDefaultTheme = (container: HTMLElement, plugin: FolderThemePlugin, _refresh: () => void) => {
    new Setting(container).setName("Default theme (fallback)").addDropdown((drop) => {
        drop.addOption("", "Keep Current Theme");
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
};

const renderDefaultMode = (container: HTMLElement, plugin: FolderThemePlugin, _refresh: () => void) => {
    new Setting(container).setName("Default mode (fallback)").addDropdown((drop) => {
        drop.addOption("", "Keep Current Mode");
        drop.addOption("light", "Light Mode");
        drop.addOption("dark", "Dark Mode");
        drop.addOption("system", "System Default");
        drop.setValue(plugin.settings.defaultMode).onChange(async (v) => {
            plugin.settings.defaultMode = v as ThemeMode;
            await plugin.saveSettings();
        });
    });
};

export default class FolderThemeSettingTab extends PluginSettingTab {
    plugin: FolderThemePlugin;
    private editingIndex: number | null = null;

    constructor(app: App, plugin: FolderThemePlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const { containerEl } = this;
        containerEl.empty();

        // Render each mapping row
        this.plugin.settings.mappings.forEach((map: FolderThemeMapping, idx: number) => {
            renderMappingRow(
                containerEl,
                map,
                idx,
                this.editingIndex,
                (newIndex) => {
                    this.editingIndex = newIndex;
                    this.display();
                },
                this.plugin,
                () => this.display(),
            );
        });

        // Controls for adding mappings and setting defaults
        renderAddMapping(containerEl, this.plugin, () => this.display());
        renderDefaultTheme(containerEl, this.plugin, () => this.display());
        renderDefaultMode(containerEl, this.plugin, () => this.display());
    }
}

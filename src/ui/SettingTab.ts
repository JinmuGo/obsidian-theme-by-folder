import { PluginSettingTab, App } from "obsidian";
import FolderThemePlugin from "../main";
import { ensureFolderDatalist } from "../utils/folderUtils";
import renderMappingRow from "./MappingRow";
import { renderAddMapping, renderDefaultTheme } from "./AddDefault";

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

        // Prepare folder datalists once
        this.plugin.settings.mappings.forEach((_, idx) => ensureFolderDatalist(containerEl, idx, this.app.vault));

        // Render rows
        this.plugin.settings.mappings.forEach((map, idx) =>
            renderMappingRow(
                containerEl,
                map,
                idx,
                this.editingIndex,
                (idxToSet) => {
                    this.editingIndex = idxToSet;
                    this.display();
                },
                this.plugin,
                () => this.display(),
            ),
        );

        renderAddMapping(containerEl, this.plugin, () => this.display());
        renderDefaultTheme(containerEl, this.plugin, () => this.display());
    }
}

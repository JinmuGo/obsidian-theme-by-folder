import { Setting } from "obsidian";
import { FolderThemeMapping } from "../settings";
import FolderThemePlugin from "../main";
import { getAvailableThemes } from "../utils/themeUtils";

export default function renderMappingRow(
    container: HTMLElement,
    map: FolderThemeMapping,
    idx: number,
    editingIndex: number | null,
    setEditingIndex: (i: number | null) => void,
    plugin: FolderThemePlugin,
    refresh: () => void,
) {
    const setting = new Setting(container);
    // Name
    if (editingIndex === idx) {
        setting
            .setName("")
            .addText((text) => {
                const inp = text.setValue(map.name).onChange((v) => (map.name = v));
                setTimeout(() => inp.inputEl.focus(), 50);
                inp.inputEl.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        setEditingIndex(null);
                        void plugin.saveSettings().then(() => {
                            refresh();
                        });
                    }
                });
                return inp;
            })
            .addButton((btn) =>
                btn
                    .setIcon("check")
                    .setTooltip("Save")
                    .onClick(async () => {
                        setEditingIndex(null);
                        await plugin.saveSettings();
                        refresh();
                    }),
            );
    } else {
        setting.setName(map.name || `Mapping ${idx + 1}`).addButton((btn) =>
            btn
                .setIcon("pencil")
                .setTooltip("Edit")
                .onClick(() => {
                    setEditingIndex(idx);
                    refresh();
                }),
        );
    }

    // Folder
    const listId = `folder-list-${idx}`;
    setting
        .addText((text) => {
            const inp = text
                .setPlaceholder("Folder path")
                .setValue(map.folder)
                .onChange(async (v) => {
                    map.folder = v;
                    await plugin.saveSettings();
                });
            inp.inputEl.setAttribute("list", listId);
            return inp;
        })
        // Theme
        .addDropdown((drop) => {
            drop.addOption("", "— keep current —");
            getAvailableThemes(plugin.app).forEach((t) => void drop.addOption(t, t));
            drop.setValue(map.theme).onChange(async (v) => {
                map.theme = v;
                await plugin.saveSettings();
            });
        })
        // Delete
        .addExtraButton((btn) =>
            btn
                .setIcon("trash")
                .setTooltip("Remove")
                .onClick(async () => {
                    plugin.settings.mappings.splice(idx, 1);
                    await plugin.saveSettings();
                    refresh();
                }),
        );
}

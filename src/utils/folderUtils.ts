import { Vault, normalizePath, TFolder } from "obsidian";

export function ensureFolderDatalist(container: HTMLElement, idx: number, vault: Vault) {
    const listId = `folder-list-${idx}`;
    if (!container.querySelector(`#${listId}`)) {
        const dataList = container.createEl("datalist", { attr: { id: listId } });
        vault
            .getAllLoadedFiles()
            .filter((f): f is TFolder => f instanceof TFolder)
            .map((f) => normalizePath(f.path))
            .forEach((p) => dataList.createEl("option", { attr: { value: p } }));
    }
}

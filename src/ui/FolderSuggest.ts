// src/utils/folderSuggest.ts

import { App, Vault, TFolder, normalizePath, AbstractInputSuggest } from "obsidian";

/**
 * Suggest handler that offers vault folder paths as you type,
 * and invokes a callback when a suggestion is chosen.
 */
export class FolderSuggest extends AbstractInputSuggest<string> {
    private onChoose: (value: string) => void;

    /**
     * @param inputEl   The <input> element to attach suggestions to
     * @param vault     Obsidian Vault, used to enumerate folders
     * @param app       Obsidian App instance, passed to super
     * @param onChoose  Callback invoked with the chosen folder path
     */
    constructor(
        inputEl: HTMLInputElement,
        private vault: Vault,
        app: App,
        onChoose: (value: string) => void,
    ) {
        super(app, inputEl);
        this.onChoose = onChoose;
    }

    /** Return a list of folder paths matching the current input */
    getSuggestions(query: string): string[] {
        const lower = query.toLowerCase();
        return this.vault
            .getAllLoadedFiles()
            .filter((f): f is TFolder => f instanceof TFolder)
            .map((f) => normalizePath(f.path))
            .filter((path) => path.toLowerCase().includes(lower));
    }

    /** Render each suggestion in the dropdown */
    renderSuggestion(path: string, el: HTMLElement): void {
        el.setText(path);
    }

    /** Handle selection: set input value and invoke callback */
    selectSuggestion(path: string): void {
        this.setValue(path);
        this.onChoose(path);
    }
}

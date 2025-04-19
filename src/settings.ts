export interface FolderThemeMapping {
    name: string;
    folder: string;
    theme: string;
}

export interface FolderThemeSettings {
    mappings: FolderThemeMapping[];
    defaultTheme: string;
}

export const DEFAULT_SETTINGS: FolderThemeSettings = {
    mappings: [],
    defaultTheme: "",
};

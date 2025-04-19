# Theme by Folder

Automatically switch Obsidian themes based on the folder of the opened note.

## Features

- **Auto Theme Switching**: Instantly changes your Obsidian theme when you open a note in a configured folder.
- **Per-Folder Configuration**: Assign custom themes to specific vault folders.
- **Fallback Theme**: Define a default theme to use when no folder mapping matches.
- **Lightweight & Fast**: Minimal performance impact with simple path-based matching.
- **User-Friendly UI**: Configure mappings directly in Obsidian’s Settings → Theme by Folder.

## Installation

### Manual Installation

1. Download or clone this repository into your vault’s plugins folder:
    ```bash
    git clone https://github.com/JinmuGo/obsidian-theme-by-folder .obsidian/plugins/theme-by-folder
    ```
2. In Obsidian, go to **Settings → Community Plugins** and enable **Theme by Folder**.
3. Reload Obsidian if the plugin doesn’t appear immediately.

### Via Community Plugins (BRAT)

You can use [BRAT (Beta Reviewer's Auto-update Tool)](https://github.com/TfTHacker/obsidian42-brat) to install this plugin before it becomes publicly listed:

1. Install the **BRAT** plugin from Obsidian's Community Plugins.
2. Go to `BRAT` settings → Click **"Add a beta plugin"**.
3. Paste the following GitHub repo URL: https://github.com/JinmuGo/obsidian-theme-by-folder
4. Click **Install** and **Enable** the plugin!

## Configuration

1. Open **Settings → Theme by Folder**.
2. Click **Add Mapping** to create a new mapping.
3. Enter a **Mapping Name**, choose or type the **Folder Path**, and select a **Theme** from the dropdown.
4. Repeat for additional folders as needed.
5. (Optional) Set a **Default Theme (fallback)** for unmatched folders.

## Usage

Once configured, simply open any note in your vault. The plugin will detect the note’s folder and automatically apply the corresponding theme. If no mapping is found, the Default Theme is used.

## Development

### Folder Structure

```
obsidian-theme-by-folder/
├── src/
│   ├── main.ts          # Core plugin logic
│   ├── settings.ts      # Types and default settings
│   ├── ui/              # UI components and renderers
│   └── utils/           # Utility functions
├── manifest.json        # Plugin manifest
├── package.json         # NPM package info
└── tsconfig.json        # TypeScript config
```

### Build

```bash
pnpm install
pnpm build
```

## Contributing

Contributions, issues, and feature requests are welcome! Please check out the [issues page](https://github.com/JinmuGo/obsidian-theme-by-folder/issues) or open a [pull request](https://github.com/JinmuGo/obsidian-theme-by-folder/pulls)

## License

This project is licensed under the 0BSD License. See [LICENSE](LICENSE) for details.

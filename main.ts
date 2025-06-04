import {
	App,
	MarkdownView,
	Notice,
	Plugin,
	PluginSettingTab,
	Setting,
} from "obsidian";
import { resumeFile } from "./ai/resumer";

// Remember to rename these classes and interfaces!

interface PluginSettings {
	mySetting: string;
}

const DEFAULT_SETTINGS: PluginSettings = {
	mySetting: "default",
};

export default class AIresumer extends Plugin {
	settings: PluginSettings;

	async onload() {
		await this.loadSettings();

		
		
		// This creates an icon in the left ribbon.
		const ribbonIconEl = this.addRibbonIcon(
			"dice",
			"Create AI resume Copy",
			async (evt: MouseEvent) => {
				// Obtiene el contenido del archivo activo
				const fileContent = await this.readActiveFileContent();
				if (!fileContent) {
					new Notice("No hay archivo activo.");
					return;
				}
				// Usa la API key guardada en settings y un idioma por defecto (puedes cambiarlo)
				const apiKey = this.settings.mySetting;
				const idioma = "español"; // O puedes pedirlo al usuario

				try {
					const resumen = await resumeFile(
						fileContent,
						apiKey,
						idioma
					);
					new Notice("Resumen generado correctamente.");
					console.log(resumen);
					// Aquí puedes mostrar el resumen, copiarlo al portapapeles, etc.
				} catch (error) {
					new Notice("Error generando el resumen.");
					console.error(error);
				}
			}
		);
		// Perform additional things with the ribbon
		ribbonIconEl.addClass("my-plugin-ribbon-class");

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText("Status Bar Text");

		// This adds a complex command that can check whether the current state of the app allows execution of the command
		this.addCommand({
			id: "start-resume-this-file",
			name: "Resume this file with AI",
			checkCallback: (checking: boolean) => {
				// Conditions to check

				console.log("Checking command execution conditions");
			},
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new SampleSettingTab(this.app, this));

		// If the plugin hooks up any global DOM events (on parts of the app that doesn't belong to this plugin)
		// Using this function will automatically remove the event listener when this plugin is disabled.
		this.registerDomEvent(document, "click", (evt: MouseEvent) => {
			console.log("click", evt);
		});

		// When registering intervals, this function will automatically clear the interval when the plugin is disabled.
		this.registerInterval(
			window.setInterval(() => console.log("setInterval"), 5 * 60 * 1000)
		);
	}

	onunload() {}

	async loadSettings() {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}

	async readActiveFileContent(): Promise<string | null> {
		// Obtiene el archivo actualmente abierto en el editor
		const activeFile = this.app.workspace.getActiveFile();
		if (!activeFile) {
			// No hay archivo abierto
			return null;
		}
		// Lee el contenido del archivo activo
		const content = await this.app.vault.read(activeFile);
		return content;
	}
}

class SampleSettingTab extends PluginSettingTab {
	plugin: AIresumer;

	constructor(app: App, plugin: AIresumer) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName("OPEN AI API Key")
			.setDesc("Enter your OpenAI API key to use AI features")
			.addText((text) =>
				text
					.setPlaceholder("Enter your OpenAI API key")
					.setValue(this.plugin.settings.mySetting)
					.onChange(async (value) => {
						this.plugin.settings.mySetting = value;
						await this.plugin.saveSettings();
					})
			);
	}
}

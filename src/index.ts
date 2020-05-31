import {
    ExtensionContext,
    LanguageClient,
    ServerOptions,
    workspace,
    LanguageClientOptions,
    commands
} from "coc.nvim";

const LanguageID = 'php';

let languageClient: LanguageClient;

export async function activate(context: ExtensionContext): Promise<void> {
    let workspaceConfig = workspace.getConfiguration();
    const config = workspaceConfig.get("phpactor") as any;
    const enable = config.enable;

    if (enable === false) return;

    languageClient = createClient(config);

    languageClient.start();
}

function createClient(config: any): LanguageClient {
    if (!config.path) {
        workspace.showMessage(
            "Configure `phpactor.path` with path to Phpactor (e.g. phpactor, or /path/to/phpactor)",
            "error"
        );
        return;
    }
    let serverOptions: ServerOptions = {
        run: {
            command: config.path,
            args: [
                "language-server"
            ]
        },
        debug: {
            command: "phpactor",
            args: [
                "language-server"
            ]
        },
    };

    let clientOptions: LanguageClientOptions = {
        documentSelector: [
            { language: LanguageID, scheme: 'file' },
            { language: LanguageID, scheme: 'untitled' }
        ],
        initializationOptions: {
        },
    };

    languageClient = new LanguageClient(
        "phpactor",
        "Phpactor Language Server",
        serverOptions,
        clientOptions
    );

    commands.registerCommand('phpactor.reindex', reindex);
    commands.registerCommand('phpactor.config.dump', dumpConfig);
    commands.registerCommand('phpactor.services.list', servicesList);
    commands.registerCommand('phpactor.status', status);

    return languageClient;
}

function reindex(): void {
	if(!languageClient) {
		return;
    }

    languageClient.sendRequest('indexer/reindex');
}

function dumpConfig(): void {
	if(!languageClient) {
		return;
    }

    languageClient.sendRequest('session/dumpConfig');
}

function servicesList(): void {
	if(!languageClient) {
		return;
    }

    languageClient.sendRequest('service/running');
}

function status(): void {
	if(!languageClient) {
		return;
    }

    languageClient.sendRequest('system/status');
}

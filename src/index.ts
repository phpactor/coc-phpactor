import {
    ExtensionContext,
    LanguageClient,
    ServerOptions,
    workspace,
    TransportKind,
    LanguageClientOptions,
} from "coc.nvim";

const LanguageID = 'php';

let languageClient: LanguageClient;
let file: string;

export async function activate(context: ExtensionContext): Promise<void> {
    let c = workspace.getConfiguration();
    const config = c.get("phpactor") as any;
    const enable = config.enable;

    if (enable === false) return;

    languageClient = createClient(context);

    languageClient.start();
}

function createClient(context: ExtensionContext): LanguageClient {
    let serverOptions: ServerOptions = {
        run: {
            command: "phpactor"
        },
        debug: {
            command: "phpactor"
        },
    };

    // todo: implements createMiddleware method
    // let middleware = createMiddleware(() => {
    // 	return languageClient;
    // });

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

    return languageClient;
}

type TextContentBlock = { type: 'text', text: string, element?: HTMLDivElement }
type ToolContentBlock = { type: 'tool', id: string, name: string, input_string: string, input?: {}, element: HTMLDivElement }
type ImageContentBlock = { type: 'image', source: { type: 'base64', media_type: string, data: string } }
type ToolResultContentBlock = { type: 'tool_result', tool_use_id: string, content: (string | ContentBlock[]), is_error?: boolean }
type ContentBlock = TextContentBlock | ToolContentBlock | ImageContentBlock | ToolResultContentBlock
type StreamingEvent = { type: 'text_start', index: number, content: { text: string } }
    | { type: 'text_delta', index: number, content: { text: string } }
    | { type: 'text_stop', index: number }
    | { type: 'tool_start', index: number, content: { id: string, name: string } }
    | { type: 'tool_delta', index: number, content: { input: string } }
    | { type: 'tool_stop', index: number }
    | { type: 'content_block_stop', index: number }

type Message = {role: string, content: ContentBlock[]}

/* Actions */

type BaseContext = {
    log: (...args: any[]) => void;
    sessionDb: import('@electric-sql/pglite').PGlite;
    getActions: () => Promise<Action[]>;
}

// Define permission flags
type PermissionFlags = {
    autoExecute?: boolean;
    autoContinue?: boolean;
    usePersistentDb?: boolean;
    useFileSystem?: boolean;
    // Add more permissions as needed
};

// Build context types dynamically based on permissions
type Context<P extends PermissionFlags> =
    BaseContext
    & (P['usePersistentDb'] extends true ? {db: import('@electric-sql/pglite').PGlite} : {})
    & (P['useFileSystem'] extends true ? {directoryHandle: FileSystemDirectoryHandle} : {});

type ActionResult = string | {} | HTMLElement

type Action<P extends PermissionFlags = PermissionFlags> = {
    name: string; // The name of the action
    description: string; // Description of what the action does
    parameters: {type: 'object', properties: Record<string, any>, required?: string[]}; // a JSON-Schema for the action_fn's parameters
    permissions?: P;
    action_fn: (context: Context<P>, params: any) => Promise<ActionResult> | ActionResult;
    test_functions?: Array<(context: Context<P>,params: any) => Promise<boolean> | boolean>;
};

// AppAction with the same generic permission structure
type AppAction = Action & {
    fileName: string;
    app_name: string;
};

type App = {
    app_name: string;
    name: string;
    description: string;
    actions: AppAction[];
    setup_fn: (()=>Promise<any>)[];
}

function defineAction<P extends PermissionFlags>(action: Action<P>): Action<P> {
    return action;
}

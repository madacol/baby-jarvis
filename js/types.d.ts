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

type Context = {
    log: (...args: any[]) => void;
    db: import('@electric-sql/pglite').PGlite;
    directoryHandle: FileSystemDirectoryHandle;
    getActions: () => Promise<Action[]>;
}

type Action = {
    name: string; // The name of the action
    description: string; // Description of what the action does
    parameters: {type: 'object', properties: Record<string, any>, required?: string[]}; // a JSON-Schema for the action_fn's parameters
    action_fn: (context: Context, params: any) => (Promise<any> | any); // The function that implements the action
    test_functions?: ((context: Context, params: any) => (Promise<any> | any))[]; // Optional test functions for the action
    permissions?: {requires_confirmation?: boolean}; // Optional permissions required by the action
}

type AppAction = Action & {
    fileName: string;
    app_name: string;
}

type App = {
    app_name: string;
    name: string;
    description: string;
    actions: AppAction[];
    setup_fn: (()=>Promise<any>)[];
}


    
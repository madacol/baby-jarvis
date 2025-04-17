# Baby Jarvis

An AI assistant that can run JavaScript code, query a DB and use/create/edit tools on the fly.

## Implementation

All tools run through a little JS runtime, right there in the browser.

### Runtime

It passes a context object to all actions, which includes:

- A database (using [PGlite](https://pglite.dev/), Postgres in WASM)
- File system access (using the File System Access API)
- Access to calling other registered actions (JS functions)

Actions are stored as JavaScript files in the `actions` directory (Saved in OPFS or in a user-chosen directory) and are loaded dynamically at runtime. Each action exports a default object with metadata and the function to execute.

The runtime handles permissions, user confirmation, and error handling for actions. Actions can be configured to:
- Run automatically without confirmation
- Persist database changes across sessions
- Allow the AI to automatically continue the conversation after execution

### Types

```typescript
type Action = {
    name: string;
    description: string;
    parameters: {type: 'object', properties: Record<string, any>, required?: string[]};
    action_fn: (context: Context, params: any) => (Promise<ActionResult> | ActionResult);
    test_functions?: ((context: Context, params: any) => (Promise<any> | any))[];
    permissions?: {
        autoExecute?: boolean, // Skip user confirmation
        autoContinue?: boolean, // Let LLM continue after execution
        persistDb?: boolean // Persist DB across sessions
    };
}
```

```typescript
type Context = {
    log: (...args: any[]) => void;
    db: import('@electric-sql/pglite').PGlite;
    directoryHandle: FileSystemDirectoryHandle;
    getActions: () => Promise<Action[]>;
}
```

### Example Action

```javascript
export default {
    name: "listDirectory",
    description: "List files in a directory",
    parameters: {
        type: "object",
        properties: {
            path: { type: "string", description: "Path to list" }
        },
        required: ["path"]
    },
    action_fn: async ({log, directoryHandle}, {path}) => {
        log('Listing directory:', path);
        const entries = [];
        
        try {
            const dirHandle = await directoryHandle.getDirectoryHandle(path);
            for await (const entry of dirHandle.values()) {
                entries.push({
                    name: entry.name,
                    kind: entry.kind
                });
            }
            return entries;
        } catch (error) {
            return `Error: ${error.message}`;
        }
    },
    permissions: {
        autoExecute: true,
        autoContinue: true
    }
}
```

# Future Work

Ability to create apps with multiple actions that share the same app context.

## Example Interaction
User: "Create a tool to create and update shopping lists"

Claude:
```javascript
({createApp}) => {
    createApp(
        ({log, sql}) => {
            log('Creating shopping-list app');
            // Create a table to store the shopping lists
            sql(`CREATE TABLE shopping_list (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`);
            // Create a table to store the items in the shopping list with a foreign key to the shopping list
            sql(`CREATE TABLE shopping_list_items (
                id INTEGER PRIMARY KEY AUTOINCREMENT, 
                name TEXT, 
                purchased BOOLEAN DEFAULT FALSE, 
                list_id INTEGER, 
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
                FOREIGN KEY (list_id) REFERENCES shopping_list(id)
            )`);
        }, [
            {
                name: 'createShoppingList',
                description: 'Create a shopping list',
                input_schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'The name of the item' },
                    },
                    required: ['name']
                },
                functionCode: `({log, sql}, {name}) => {
                    log('Creating shopping list');
                    return sql('INSERT INTO shopping_list (name) VALUES (${name})');
                }`
            },
            {
                name: 'deleteShoppingList',
                description: 'Delete a shopping list',
                input_schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'The name of the item' },
                    },
                    required: ['name']
                },
                functionCode: `({log, sql}, {name}) => {
                    log('Deleting shopping list');
                    return sql('DELETE FROM shopping_list WHERE name = ${name}');
                }`
            },
            {
                name: 'getItems',
                description: 'Get the items in a shopping list',
                input_schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'The name of the shopping list' },
                    },
                    required: ['name']
                },
                functionCode: `({log, sql}, {name}) => {
                    log('Getting items in shopping list');
                    return sql('SELECT * FROM shopping_list_items WHERE list_name = ${name}');
                }`
            },
            {
                name: 'addItem',
                description: 'Add an item to a shopping list',
                input_schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'The name of the item' },
                        listName: { type: 'string', description: 'The name of the shopping list' },
                    },
                    required: ['name', 'listName']
                },
                functionCode: `({log, sql}, {name, listName}) => {
                    log('Adding item to shopping list');
                    return sql('INSERT INTO shopping_list_items (name, list_name) VALUES (${name}, ${listName})');
                }`
            },
            {
                name: 'removeItem',
                description: 'Remove an item from a shopping list',
                input_schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'The name of the item' },
                        listName: { type: 'string', description: 'The name of the shopping list' },
                    },
                    required: ['name', 'listName']
                },
                functionCode: `({log, sql}, {name, listName}) => {
                    log('Removing item from shopping list');
                    return sql('DELETE FROM shopping_list_items WHERE name = ${name} AND list_name = ${listName}');
                }`
            },
            {
                name: 'markItem',
                description: 'Mark an item as purchased',
                input_schema: {
                    type: 'object',
                    properties: {
                        name: { type: 'string', description: 'The name of the item' },
                        listName: { type: 'string', description: 'The name of the shopping list' },
                    },
                    required: ['name', 'listName']
                },
                functionCode: `({log, sql}, {name, listName}) => {
                    log('Marking item as purchased');
                    return sql('UPDATE shopping_list_items SET purchased = true WHERE name = ${name} AND list_name = ${listName}');
                }`
            }
        ]
    );
}
```

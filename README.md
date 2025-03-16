# Advanced Function Execution System with Claude Tool Integration

## Overview

A system that leverages Claude's native tool use functionality to execute JavaScript code through a dedicated `runJavaScript` tool.

## Current Implementation

### Tool-Based Execution System

```javascript
// Example tool definition from app.js
{
  name: "runJavaScript",
  description: "Execute arbitrary JavaScript code and return the result...",
  input_schema: {
    type: "object",
    properties: {
      code: {
        type: "string",
        description: "The JavaScript code to execute as an arrow function..."
      }
    },
    required: ["code"]
  }
}
```

### Execution Flow

1. User sends natural language request
2. AI determines when code execution is needed
3. Uses `runJavaScript` tool with code parameter
4. Execution results are returned to the conversation
5. AI analyzes the results and decides if it's done or needs to execute more code

### Tool Execution Runtime

The runtime expects that the code returns an arrow function that takes the context as an argument.

```javascript
// Simplified runtime.js implementation
async function runJs(code) {
  const context = {
    getTool: async (name) => {/* ... */},
    log: (...args) => {/* ... */},
    sql: async (query) => {/* ... */},
    ...
  };

  const fn = Function(`return ${code}`)();
  return await fn(context);
}
```

## Future Directions (very rough ideas)

### Tool Creation System

```javascript
/**
 * @param {function} setupFunction - A function that will be passed the context object of the Javascript runtime
 * @param {Array<{ name: string, description: string, input_schema: {}, functionCode: string }>} tools - An array of tools to be created
 */
async function createTool(setupFunction, tools) {
    setupFunction(context)
    // Store tool in database
    tools.forEach(tool => {
        toolsDb[tool.name] = tool;
    });
}
```

This function will be a tool that can be used to create other tools.

It will not be passed as a LLM tool directly, but instead will be passed in the context object of the Javascript runtime

### Other Tools

- `createTool`: Define new tools with JavaScript implementations
- `getTool`: Retrieve and execute existing tools
- `listTools`: View available tools and their capabilities
- Versioned tool definitions
- Tool permission system

### Enhanced Context Management

```javascript
// Proposed context expansion
const advancedContext = {
  log: (...args) => {/* ... */},
  sql: async (query) => {/* ... */},
  getTool: async (name) => {/* ... */},
  createTool: async (setupFunction, tools) => {/* ... */},
  listTools: async () => {/* ... */},
  ...
};
```

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
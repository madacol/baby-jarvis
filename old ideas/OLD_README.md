# Advanced Function Execution System with JavaScript Runtime

## Overview

A system that allows a LLM to execute JavaScript directly with a special code block identifier that makes clear this is code meant to be executed. This approach enables the LLM to combine multiple functions, create new tools, and maintain a shared context and database.

## Code Block Identifier

The system uses *```run-js* as the code block marker. All code blocks must be written as arrow functions that receive a context parameter:

  ```run-js
  ({getTool, log}) => {
      log('Starting task...');
      return await getTool('someFunction')(param1, param2);
  }
  ```

## System Architecture

### 1. JavaScript Execution Engine

```javascript

function runJs(code) {
  // Context shared across all executions
  const context = {
    getTool,
    log,
    sql
  }
  // Execute the code as an arrow function with context
  return getFunction(code)(context);
}

/**
 * Get function helper
 * @param {string} code - The code to get the function from
 * @returns {Function} The function
 */
function getFunction(code) {
  // Recover the function from the code
  return Function(`return ${code}`)();
}

/**
 * Get tool helper
 * @param {string} name - The name of the tool to get
 * @returns {Function} The tool function
 */
async function getTool(name) {
    const [tool] = await sql`SELECT * FROM tools WHERE name = ${name}`;
    if (!tool) throw new Error(`Tool "${name}" not found`);
    // Recover the function from the code
    const toolFn = getFunction(tool.code);
    return toolFn;
}

/**
 * Logging with real-time display
 * @param {...any} args - The arguments to log
 */
function log(...args) {
    const message = args.join(' ');
    // Display to user in real-time
    console.log(...args);
}

/**
 * Database interface
 * @param {string} query - The SQL query
 * @param {any[]} params - The parameters for the query
 * @returns {Promise<any[]>} The result of the query
 */
async function sql(query, params) {
    // Implementation of SQL tagged template literal
}
```

### 2. LLM Response Parser

```javascript
/**
 * Parses LLM responses to extract run-js code blocks
 * @param {string} llmResponse - The full response from the LLM
 * @returns {Object} Parsed response with code blocks and modified message
 */
function parseLLMResponse(llmResponse) {
    // Look for run-js code blocks
    const codeBlockRegex = /```run-js\s*([\s\S]*?)\s*```/g;
    const matches = [...llmResponse.matchAll(codeBlockRegex)];
    
    // Extract all code blocks
    const codeBlocks = matches.map(match => match[1].trim());
    
    // Replace code blocks with placeholders for later
    let cleanMessage = llmResponse;
    matches.forEach((match, index) => {
        cleanMessage = cleanMessage.replace(match[0], `[CODE_EXECUTION_${index}]`);
    });
    
    return {
        message: cleanMessage,
        codeBlocks
    };
}
```

## Example Tool Creation Functions

Here's an example of how the LLM might create tools using the system:

    ```run-js
    ({getTool, log, sql}) => {
        // Create a video downloader tool
        await getTool('createTool')(
            "downloadVideo", 
            "Downloads a video from a URL with optional quality settings. Example: downloadVideo('https://example.com/video.mp4', 'high')",
            async (url, quality = "high") => {
                log(`Downloading video from ${url} with ${quality} quality`);
                
                // Validate URL
                if (!url || !url.match(/^https?:\/\/.+/)) {
                    throw new Error("Invalid URL provided");
                }
                
                try {
                    // This would be the actual implementation
                    // Simulated for this example
                    await new Promise(resolve => setTimeout(resolve, 2000));
                    
                    // Record download in database
                    await sql`
                        INSERT INTO downloads (url, quality, timestamp) 
                        VALUES (${url}, ${quality}, ${new Date().toISOString()})
                    `;
                    
                    return {
                        filePath: `/downloads/${Date.now()}_video.mp4`,
                        quality: quality
                    };
                } catch (error) {
                    throw error;
                }
            }
        );
    }
    ```

---

    ```run-js
    ({getTool, log, sql}) => {
        // Create a tool to get download history
        await getTool('createTool')(
            "getDownloadHistory",
            "Retrieves history of downloaded videos. Example: getDownloadHistory(5) to get the last 5 downloads",
            async (limit = 10) => {
                try {
                    const downloads = await sql`
                        SELECT * FROM downloads 
                        ORDER BY timestamp DESC 
                        LIMIT ${limit}
                    `;
                    
                    return downloads;
                } catch (error) {
                    throw error;
                }
            }
        );

        // Return list of available tools
        return await getTool('listTools')();
    }
    ```

## Full User Interaction Example

User: "Can you download this video for me? https://www.youtube.com/watch?v=dQw4w9WgXcQ"

LLM Response:

    I'll download that YouTube video for you right away!

    ```run-js
    ({getTool, log}) => {
      const videoUrl = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
      log("Starting download process...");
      return await getTool('downloadVideo')(videoUrl, "high");
    }
    ```

    Starting download process...
    Downloading video from https://www.youtube.com/watch?v=dQw4w9WgXcQ with high quality
    Result: {
      "filePath": "/downloads/1714817294812_video.mp4",
      "quality": "high"
    }

    Great! I've downloaded the video for you. You can find it at the file path shown above. The download has been saved in high quality.

    Is there anything else you'd like to do with this video?

This system provides a powerful yet controlled way for the LLM to execute JavaScript code, create new tools, and maintain shared context across interactions. The ```run-js code block identifier makes it clear when code execution is happening.
 
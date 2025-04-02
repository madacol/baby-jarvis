/** @type {Action} */
export default {
  name: "shoppingListManager",
  description: `A comprehensive shopping list management tool that allows adding, removing, viewing, and updating shopping list items. 

Supports the following operations:
- Add items to the shopping list
- Remove items from the shopping list
- View the entire shopping list
- Clear the entire shopping list
- Mark items as purchased

Each item can have a name, quantity, optional category, and optional priority level.`,
  parameters: {
  "type": "object",
  "properties": {
    "operation": {
      "type": "string",
      "enum": [
        "add",
        "remove",
        "view",
        "clear",
        "purchase"
      ],
      "description": "The operation to perform on the shopping list"
    },
    "item": {
      "type": "object",
      "properties": {
        "name": {
          "type": "string",
          "description": "Name of the shopping list item"
        },
        "quantity": {
          "type": "number",
          "description": "Quantity of the item",
          "default": 1
        },
        "category": {
          "type": "string",
          "description": "Optional category for the item",
          "default": "Misc"
        },
        "priority": {
          "type": "string",
          "enum": [
            "low",
            "medium",
            "high"
          ],
          "description": "Priority level of the item",
          "default": "medium"
        }
      },
      "required": [
        "name"
      ]
    }
  },
  "required": [
    "operation"
  ]
},
  action_fn: (context, params) => {
  const { log, db } = context;

  // Ensure the shopping list table exists
  const initTable = async () => {
    await db.sql`
      CREATE TABLE IF NOT EXISTS shopping_list (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        quantity INTEGER DEFAULT 1,
        category TEXT DEFAULT 'Misc',
        purchased BOOLEAN DEFAULT 0
      )
    `;
  };

  // Add an item to the shopping list
  const addItem = async (item) => {
    await initTable();
    const { name, quantity = 1, category = 'Misc' } = item;
    
    // Check if item already exists
    const existingItem = await db.sql`
      SELECT * FROM shopping_list 
      WHERE name = ${name} AND category = ${category}
    `;

    if (existingItem.length > 0) {
      // Update quantity if item exists
      await db.sql`
        UPDATE shopping_list 
        SET quantity = quantity + ${quantity} 
        WHERE name = ${name} AND category = ${category}
      `;
      return `Updated ${name}. New quantity: ${existingItem[0].quantity + quantity}`;
    } else {
      // Insert new item
      await db.sql`
        INSERT INTO shopping_list (name, quantity, category) 
        VALUES (${name}, ${quantity}, ${category})
      `;
      return `Added ${quantity} ${name} to ${category} category`;
    }
  };

  // Remove an item from the shopping list
  const removeItem = async (item) => {
    await initTable();
    const { name, category } = item;
    
    const result = await db.sql`
      DELETE FROM shopping_list 
      WHERE name = ${name} AND category = ${category || 'Misc'}
    `;

    return result.rowCount > 0 
      ? `Removed ${name} from the shopping list` 
      : `${name} not found in the shopping list`;
  };

  // View the shopping list
  const viewList = async () => {
    await initTable();
    const items = await db.sql`
      SELECT * FROM shopping_list 
      ORDER BY category, name
    `;

    if (items.length === 0) {
      return "Your shopping list is empty.";
    }

    // Group items by category
    const categorizedList = items.reduce((acc, item) => {
      if (!acc[item.category]) {
        acc[item.category] = [];
      }
      acc[item.category].push(`${item.name} (${item.quantity})`);
      return acc;
    }, {});

    let formattedList = "Shopping List:\n";
    for (const [category, items] of Object.entries(categorizedList)) {
      formattedList += `\n${category}:\n`;
      items.forEach(item => {
        formattedList += `- ${item}\n`;
      });
    }

    return formattedList;
  };

  // Clear the entire shopping list
  const clearList = async () => {
    await initTable();
    await db.sql`DELETE FROM shopping_list`;
    return "Shopping list has been cleared.";
  };

  // Mark an item as purchased
  const purchaseItem = async (item) => {
    await initTable();
    const { name, category } = item;
    
    const result = await db.sql`
      UPDATE shopping_list 
      SET purchased = 1 
      WHERE name = ${name} AND category = ${category || 'Misc'}
    `;

    return result.rowCount > 0 
      ? `Marked ${name} as purchased` 
      : `${name} not found in the shopping list`;
  };

  // Main operation dispatcher
  switch (params.operation) {
    case 'add':
      return addItem(params.item);
    case 'remove':
      return removeItem(params.item);
    case 'view':
      return viewList();
    case 'clear':
      return clearList();
    case 'purchase':
      return purchaseItem(params.item);
    default:
      return "Invalid operation. Choose 'add', 'remove', 'view', 'clear', or 'purchase'.";
  }
},
  test_functions: []
};
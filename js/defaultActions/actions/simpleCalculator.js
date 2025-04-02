/** @type {Action} */
export default {
  name: "simpleCalculator",
  description: "A calculator that performs various arithmetic operations including addition, subtraction, multiplication, and division.",
  parameters: {
  "type": "object",
  "properties": {
    "operation": {
      "type": "string",
      "enum": [
        "add",
        "subtract",
        "multiply",
        "divide"
      ],
      "description": "The arithmetic operation to perform"
    },
    "a": {
      "type": "number",
      "description": "First number"
    },
    "b": {
      "type": "number",
      "description": "Second number"
    }
  },
  "required": [
    "operation",
    "a",
    "b"
  ]
},
  action_fn: ({log}, params) => {
  const { operation, a, b } = params;
  
  if (typeof a !== 'number' || typeof b !== 'number') {
    return {
      success: false,
      error: "Both numbers must be valid numeric values"
    };
  }
  
  switch (operation) {
    case 'add':
      return {
        success: true,
        result: a + b,
        equation: `${a} + ${b} = ${a + b}`
      };
    case 'subtract':
      return {
        success: true,
        result: a - b,
        equation: `${a} - ${b} = ${a - b}`
      };
    case 'multiply':
      return {
        success: true,
        result: a * b,
        equation: `${a} × ${b} = ${a * b}`
      };
    case 'divide':
      if (b === 0) {
        return {
          success: false,
          error: "Cannot divide by zero"
        };
      }
      return {
        success: true,
        result: a / b,
        equation: `${a} ÷ ${b} = ${a / b}`
      };
    default:
      return {
        success: false,
        error: `Unknown operation: ${operation}. Valid operations are: add, subtract, multiply, divide`
      };
  }
},
  test_functions: []
};
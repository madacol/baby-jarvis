/** @type {Action} */
export default {
  name: "sumTwoNumbers",
  description: "A function that takes two numbers and returns their sum",
  parameters: {
  "type": "object",
  "properties": {
    "a": {
      "type": "number"
    },
    "b": {
      "type": "number"
    }
  }
},
  action_fn: ({log}, {a, b}) => {
  return a + b;
},
  test_functions: []
};

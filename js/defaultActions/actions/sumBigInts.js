/** @type {Action} */
export default {
  name: "sumBigInts",
  description: "A function that takes two BigInt numbers and returns their sum",
  parameters: {
  "type": "object",
  "properties": {
    "a": {
      "type": "string"
    },
    "b": {
      "type": "string"
    }
  }
},
  action_fn: ({log}, {a, b}) => {
  // Convert input strings to BigInt
  const bigIntA = BigInt(a);
  const bigIntB = BigInt(b);
  
  // Perform BigInt addition and convert back to string
  return (bigIntA + bigIntB).toString();
},
  test_functions: []
};

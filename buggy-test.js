function calculateTotal(price, quantity) {
    return price + quantity;
}

const total = calculateTotal(100, 5);

// print the output
// live tests

console.log("Total:", total);

// duplicate-test.js
function makeRandomToken(size) {
  return Math.random().toString(36).substring(2, 2 + size);
}
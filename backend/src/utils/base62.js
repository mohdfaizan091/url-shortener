const ALPHABET = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
const BASE = ALPHABET.length; // 62

// Converts a plain integer (the counter value) into a Base62 string.
// Same idea as converting to hex or binary, just with a 62-character
// alphabet instead of 16 or 2 — more symbols per digit = shorter string
// for the same number. This is what actually shortens the URL.
const toBase62 = (num) => {
  if (num === 0) return ALPHABET[0];

  let result = "";
  while (num > 0) {
    result = ALPHABET[num % BASE] + result;
    num = Math.floor(num / BASE);
  }
  return result;
};

module.exports = { toBase62 };
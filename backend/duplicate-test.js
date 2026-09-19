function makeRandomToken(size) {
  return Math.random().toString(36).substring(2, 2 + size);
}

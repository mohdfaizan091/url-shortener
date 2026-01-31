const { nanoid } = require("nanoid");

const generateCode = () => {
    return nanoid(7);
};

module.exports = generateCode;
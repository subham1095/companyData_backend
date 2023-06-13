const uuid = require("uuid");

const generateRandomPassword = (length = 8) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
  return result;
};

const generateUUID = () => {
  return uuid.v4();
};

module.exports = { generateRandomPassword, generateUUID };

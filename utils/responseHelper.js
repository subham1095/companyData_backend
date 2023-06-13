const commonResponse = (success, message, data = {}) => {
  return {
    success,
    message,
    data,
  };
};

module.exports = { commonResponse };

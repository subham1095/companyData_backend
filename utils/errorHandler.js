const errorHandler = (err) => {
  console.log("err", err);
  let status = 500;
  let message = "Internal Server error";
  error = {};
  return { status, message, error };
};

module.exports = { errorHandler };

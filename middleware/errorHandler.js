const logger = require("./logger");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  logger.error({
    message: err.message,
    stack: err.stack,
    route: req.originalUrl,
    method: req.method,
  });

  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};

module.exports = errorHandler;

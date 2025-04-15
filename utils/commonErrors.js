const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

const notFoundError = (resource = "Resource") =>
  createError(`${resource} not found`, 404);

const conflictError = (message = "Conflict") => createError(message, 409);

const badRequestError = (message = "Bad Request") => createError(message, 400);

const unauthorizedError = (message = "Unauthorized") =>
  createError(message, 401);

module.exports = {
  createError,
  notFoundError,
  conflictError,
  badRequestError,
  unauthorizedError,
};

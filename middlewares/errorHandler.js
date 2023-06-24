// not found

const notFound = (req, res, next) => {
  const error = new Error(`Not found: ${req.originalUrl}`);
  res.status(404);
  return next(error);
};

// Error handler

const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
  res.status(statusCode);
  res.json({
    status: res.statusCode,
    message: err?.message,
    stack: err?.stack,
  });
};

module.exports = { errorHandler, notFound };

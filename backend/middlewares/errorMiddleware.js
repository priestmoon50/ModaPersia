const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode);

  if (process.env.NODE_ENV !== 'production') {
    console.error(`Error: ${err.message}`);
    console.error(err.stack);
  } else {
    // Log to external service like Sentry in production
    // Sentry.captureException(err);
  }

  res.json({
    status: 'error',
    message: process.env.NODE_ENV === 'production'
      ? 'An unexpected error occurred'
      : err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack,
  });
};

module.exports = { errorHandler };

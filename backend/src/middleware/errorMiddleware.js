export const notFoundHandler = (req, res) => {
  res.status(404).json({ message: `Route not found: ${req.originalUrl}` });
};

export const errorHandler = (error, _req, res, _next) => {
  if (res.headersSent) {
    return;
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || "Unexpected server error"
  });
};

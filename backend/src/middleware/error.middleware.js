const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
};

const errorHandler = (err, req, res, next) => {
  // Handle JSON syntax errors in request bodies
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON in request body",
    });
  }

  // Handle Prisma unique constraint error
  if (err.code === "P2002") {
    const fields = err.meta?.target ? (Array.isArray(err.meta.target) ? err.meta.target.join(", ") : err.meta.target) : "field";
    return res.status(409).json({
      success: false,
      message: `A record with this ${fields} already exists`,
    });
  }

  // Handle Prisma record not found error
  if (err.code === "P2025") {
    return res.status(404).json({
      success: false,
      message: "The requested record was not found",
    });
  }

  // Handle Prisma foreign key constraint failed
  if (err.code === "P2003") {
    return res.status(400).json({
      success: false,
      message: "Operation failed due to related record constraint",
    });
  }

  console.error("Unhandled error:", err);

  const statusCode = err.statusCode || err.status || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV !== "production" && { stack: err.stack }),
  });
};

module.exports = {
  notFoundHandler,
  errorHandler,
};
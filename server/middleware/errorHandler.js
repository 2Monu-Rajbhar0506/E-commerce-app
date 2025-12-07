export const errorHandler = (err, req, res, next) => {
  console.error("SERVER ERROR:", err);

  return res.status(err.statusCode || 500).json({
    success: false,
    error: true,
    message: err.message || "Internal Server Error",
  });
};

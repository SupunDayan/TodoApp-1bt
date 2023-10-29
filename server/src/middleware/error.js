export const errorHandler = (err, req, res, next) => {
  console.log(err.message);
  res.status(err.statusCode || 500).json({
    success: false,
    error: err.message || "Server Error",
  });
};

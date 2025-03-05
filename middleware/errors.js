export const error = (err, req, res, next) => {
  if (err.status) {
    res.status(err.status);
    return res.json({
      status: err.status,
      message: err.message,
    });
  } else {
    return res.status(500).json({
      status: err.statusCode,
      message: err.message,
    });
  }
};

export const notFound = (req, res, next) => {
  const error = new Error("Not Found");
  error.status = 500;
  next(error);
};

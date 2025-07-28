function responseError(err, res) {
  console.log(err);
  if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
    return res.sendStatus(403); // Token is not correct
  }
  res.status(500).json({
    message: "Đã xảy ra lỗi server",
  });
}

export default responseError;

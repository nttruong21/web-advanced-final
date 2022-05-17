module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  });
};

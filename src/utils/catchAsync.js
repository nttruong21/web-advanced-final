module.exports = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    console.error(err);
  });
};

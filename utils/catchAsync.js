// module.exports = (fn) => (req, res, next) => {
//   fn(req, res, next).catch(next());
// };
module.exports = (callback) =>
  function (req, res, next) {
    callback(req, res, next).catch(next);
  };

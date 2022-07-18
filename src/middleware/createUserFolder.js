const path = require("path");
var fs = require("fs");

module.exports = function (req, res, next) {

  const dir = `${path.resolve(__dirname, "..", "tmp")}/${req.user.id}`;
  const dirAvatar = `${path.resolve(__dirname, "..", "tmp")}/${req.user.id}/avatar`;
  const dirContract = `${path.resolve(__dirname, "..", "tmp")}/${req.user.id}/contract`;

  const directories = [dir, dirAvatar, dirContract]

  directories.forEach(directory => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
      }
  })

  next();
};

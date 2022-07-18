const multer = require("multer");
const crypto = require("crypto");
const path = require("path");

module.exports = (action) => {
  let directory;
  let allowedMimes;

  if (action === "contract") {
    directory = "contract";
    allowedMimes = [
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/pdf",
      "application/octet-stream",
    ];
  }

  if (action === "avatar") {
    directory = "avatar";
    allowedMimes = ["image/jpeg", "image/pjepg", "image/png", "image/jpg"];
  }

  return multer({
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        return cb(
          null,
          path.resolve(
            __dirname,
            "..",
            "tmp",
            req.user.id.toString(),
            directory
          )
        );
      },
      filename: (req, file, cb) => {
        crypto.randomBytes(16, (err, hash) => {
          if (err) cb(err);
          file.key = `${hash.toString("hex")}-${file.originalname}`;
          cb(null, file.key);
        });
      },
    }),
    limits: {
      fileSize: 2 * 1024 * 1024,
    },
    fileFilter: (req, file, cb) => {
      if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error("Invalid file type."));
      }
    },
  }).single("file");
};

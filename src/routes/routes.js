const express = require("express");
const routes = express.Router();
const cors = require("cors");
const path = require("path");
const error = require("../middleware/error");
require("express-async-errors");
const { clientUrl } = require("../config/app");
const uploadSingleFile = require("../middleware/uploadSingleFile");
const createUserFolder = require("../middleware/createUserFolder");
const {validateClockTime,validateUser, validateAuth} = require("./validation")
const validator = require("../middleware/validator")
const privilleges = require("../middleware/acessPrivilleges")

const authController = require("../controllers/authController");
const userController = require("../controllers/userController");
const clockTimeController = require("../controllers/clockTimeController");
const reportController = require("../controllers/reportController");
const uploadFilesController = require("../controllers/uploadFilesController");

const auth = require("../middleware/auth");

const corsOptions = {
  origin: clientUrl,
  exposedHeaders: "token",
};

routes.use(cors(corsOptions));

routes.post("/user",validator(validateUser),userController.storeUser);
routes.get("/user", auth, userController.getUser);
routes.put("/user", auth, userController.updateUser);

routes.get("/all-users",  [auth, privilleges("admin")], userController.getAllUsers);


routes.post(
  "/upload/avatar",
  [auth, createUserFolder, uploadSingleFile("avatar")],
  uploadFilesController.storeAvatar
);
routes.delete("/upload/avatar", auth, uploadFilesController.deleteAvatar);

routes.post(
  "/upload/contract",
  [auth, uploadSingleFile("contract")],
  uploadFilesController.storeContract
);
routes.delete("/upload/contract", auth, uploadFilesController.deleteContract);

routes.get(
  "/reports/all-total-hours-worked",
  [auth, privilleges("admin")],
  reportController.getAllUserWorkedHours
);
routes.get("/reports/user-total-hours-worked",auth ,reportController.getUserTotalWorkedHours);


routes.post("/clock-timer/clock-in", [validator(validateClockTime), auth], clockTimeController.storeClockIn);
routes.post(
  "/clock-timer/other-clocks",
  auth,
  clockTimeController.storeOtherClocks
);
routes.get("/clock-timer/all", auth, clockTimeController.getAllClocks);
routes.get("/clock-timer/user", auth, clockTimeController.getUserClocks);

routes.post("/auth", validator(validateAuth), authController.login);

routes.use(
  "/avatar",
  express.static(path.resolve(__dirname, "..", "tmp"))
);
routes.use(
  "/contract",
  express.static(path.resolve(__dirname, "..", "tmp"))
);

routes.use(error);

module.exports = routes;

const express = require("express");
const { appPort} = require("./config/app")
const app = express();
const routes = require("./routes/routes");
require('dotenv').config()
require("./models");

app.use(express.json());
app.use(routes);

const port = appPort || 3003;
app.listen(port, () =>
  (`Listening on port ${port}...`)
);
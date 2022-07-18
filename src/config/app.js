require("dotenv").config();



module.exports = {
    appEnv: process.env.NODE_ENV,
    appUrl: process.env.APP_URL,
    appPort: process.env.APP_PORT,
    tokenExpiresIn: 3600,
    clientUrl: process.env.CLIENT_URL,
    privateJwtKey: process.env.PRIVATE_JWT_KEY
  };
  
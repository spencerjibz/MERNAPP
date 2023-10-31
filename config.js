let config = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || 5000,
  URL: process.env.BASE_URL || `http://localhost:${5000}`,
  MONGODB_URI: process.env.MONGODB_URI || "mongodb://localhost:27017/myapi",
  TOKEN_SEC: process.env.TOKEN_SEC || "secretKey",
  NODE_MAILER_EA: process.env.NODE_MAILER_EA || "",
  NODE_MAILER_SERVICE: process.env.NODE_MAILER_SERVICE || "Gmail",
  NODE_MAILER_PASS: process.env.NODE_MAILER_PASS || "your email",
  /*
    ADD AS MUCH CONFIG PROPS AS YOU LIKE FProOR YOUR APP, 

    
    */
};
module.exports = config;

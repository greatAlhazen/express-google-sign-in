const https = require("https");
require("dotenv").config();
const fs = require("fs");

const PORT = process.env.PORT || 3000;

const app = require("./app");

// create secure http connection with ssl-certificates
const server = https.createServer(
  {
    key: fs.readFileSync("key.pem"),
    cert: fs.readFileSync("cert.pem"),
  },
  app
);

server.listen(PORT, () => {
  console.log(`application running on ${PORT}`);
});

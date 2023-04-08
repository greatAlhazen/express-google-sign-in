const http = require("http");
require("dotenv").config();

const PORT = process.env.PORT || 3000;

const app = require("./app");
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`application running on ${PORT}`);
});

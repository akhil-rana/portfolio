const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();
app.use(cors());

// Serve only the static files form the src directory
app.use(express.static(__dirname + "/src"));

app.get("/*", function(req, res) {
  res.sendFile(path.join(__dirname + "/src/index.html"));
});


app.listen(process.env.PORT || 8080);
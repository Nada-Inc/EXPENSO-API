const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes
const test = require("./controller/test");
const user = require("./controller/user");

app.use("/test", test);
app.use("/user", user)


module.exports =app;
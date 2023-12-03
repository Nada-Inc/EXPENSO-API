const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes
const test = require("./controller/test");

app.use("/test", test);


module.exports =app;
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
const fixedIncome = require("./controller/fixedIncome");

app.use("/test", test);
app.use("/user", user);
app.use("/fixedIncome", fixedIncome);


module.exports =app;
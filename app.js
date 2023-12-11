const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const autoCredit=require('./utils/fixedIncomeAdd')
const cron = require('node-cron');
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes
const test = require("./controller/test");
const user = require("./controller/user");
const fixedIncome = require("./controller/fixedIncome");
const fixedIncomeData = require("./controller/fixedIncomeData");


app.use("/test", test);
app.use("/user", user);
app.use("/fixedIncome", fixedIncome);
app.use("/fixedIncomeData", fixedIncomeData);

// cron.schedule('*/5 * * * *', async () => {
//     await autoCredit();
//   });


module.exports =app;
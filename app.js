const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require("cors");
const autoCredit = require('./utils/fixedIncomeAdd')
const cron = require('node-cron');
app.use(cors());

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./swagger_output.json')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// import routes
const test = require("./controller/test");
const user = require("./controller/user");
const fixedIncome = require("./controller/fixedIncome");
const fixedIncomeData = require("./controller/fixedIncomeData");
const fixedExpense = require("./controller/fixedExpense");
const variableExpense = require("./controller/variableExpense");

const noteUser = require("./controller/noteController/noteuser")

app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))
app.use("/test", test);
app.use("/user", user);

app.use("/fixedIncome", fixedIncome);
app.use("/fixedIncomeData", fixedIncomeData);

app.use("/fixedExpense", fixedExpense);
app.use("/variableExpense", variableExpense);

app.use("/notes", noteUser);

// cron.schedule('*/5 * * * *', async () => {
//     await autoCredit();
//   });


module.exports = app;
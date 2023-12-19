const swaggerAutogen = require('swagger-autogen')()

const outputFile = './swagger_output.json'
const endpointsFiles = ['./controller/user.js', './controller/fixedIncome.js', './controller/fixedIncomeData.js']

swaggerAutogen(outputFile, endpointsFiles)
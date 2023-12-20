const swaggerAutogen = require('swagger-autogen')()

const doc = {
    info: {
        version: "1.0.0",
        title: "Expenso REST API",
        description: ""
    },
    host: "localhost:8000",
    basePath: "/",
}

const outputFile = './swagger_output.json'
const endpointsFiles = ['./app.js']

swaggerAutogen(outputFile, endpointsFiles, doc)

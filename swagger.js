const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Auth API',
      version: '1.0.0',
      description: 'Authentication API with JWT & CRUD for posts',
    },
    servers: [
      {
        url: 'http://64.23.184.122:5000', // Change this to your remote server IP or domain
        description: 'Remote server',
      },
      {
        url: 'http://localhost:5000',
        description: 'Local server',
      },
    ],
  },
  apis: ['./routes/*.js'],
};

const swaggerSpec = swaggerJsdoc(options);

const swaggerDocs = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger Docs available at:');
  console.log('Local: http://localhost:5000/api-docs');
  console.log('Remote: http://64.23.184.122:5000/api-docs');
};

module.exports = swaggerDocs;

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Complaint Management System API',
      version: '1.0.0',
      description: 'API documentation for Complaint Management System',
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Local server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        AuthResponse: {
          type: 'object',
          properties: {
            message: { type: 'string' },
            token: { type: 'string' },
            user: {
              type: 'object',
              properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                email: { type: 'string' },
                onboarding_stage: { type: 'integer' }
              }
            }
          }
        },
        Complaint: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            complaint_type: {
              type: 'string',
              enum: ['live_demo', 'billing_issue', 'technical_issue', 'feedback']
            },
            status: {
              type: 'string',
              enum: ['raised', 'in_progress', 'waiting_on_user', 'resolved', 'closed']
            },
            created_at: { type: 'string', format: 'date-time' }
          }
        }
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/routes/*.js'],
};

module.exports = swaggerJSDoc(options);

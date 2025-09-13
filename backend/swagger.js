const swaggerAutogen = require('swagger-autogen')();

// Define the Swagger options
const outputFile = './swagger-output.json';  // Path where the generated Swagger JSON will be saved

// Define the route files to generate documentation for
const endpointsFiles = [
  './routes/authRoutes.js',   // Path to the authentication routes
  './routes/adminRoutes.js',  // Path to the admin routes
  './routes/userRoutes.js',   // Path to the user routes
  './routes/ownerRoutes.js'   // Path to the owner routes
];

// Swagger info (customize this part)
const doc = {
  info: {
    title: 'Store Rating API',
    description: 'API documentation for the store rating system',
    version: '1.0.0',
  },
  host: 'localhost:5050',  // Change to your production host
  schemes: ['http'],  // or 'https' if using SSL
  basePath: '/api',  // This ensures the /api is considered the base path for all routes
  // Here we explicitly define the /api prefix, and Swagger will append it to every route
};

// Generate the Swagger JSON
swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  console.log('Swagger docs generated');
});

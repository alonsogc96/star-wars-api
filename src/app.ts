import express from 'express';
import serverless from 'serverless-http';
import swaggerUI from 'swagger-ui-express';
import routes from './routes'; // Importamos las rutas

// Crear la aplicación Express
const app = express();

// Middleware para procesar JSON
app.use(express.json());

// Usar las rutas definidas en 'apiRoutes'
app.use('/api', routes); // Añadir un prefijo '/api' a todas las rutas

// Exportar la aplicación Express con serverless-http para ser usada en Lambda
export const handler = serverless(app);

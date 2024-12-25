import swaggerJSDoc from 'swagger-jsdoc';
import YAML from 'yamljs';
import path from 'path';

// Cargar el archivo YAML
const swaggerDocument = YAML.load(path.join(__dirname, 'swagger.yml'));

// Opciones de configuración de Swagger
const options = {
  definition: swaggerDocument, // Usar la documentación del archivo YAML directamente
  apis: ['./src/app.ts'], // O la ruta a tus archivos de rutas
};

// Genera la documentación Swagger a partir del archivo YAML
const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec };

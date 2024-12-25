# Star Wars API

Una API desarrollada en TypeScript que permite obtener información sobre personajes de Star Wars desde dos fuentes: **MyAPI** (una API propia) y **SWAPI** (Star Wars API pública).

## Requisitos

- Node.js 22.x o superior
- NPM o Yarn para gestión de dependencias

## Instalación

1. Clona este repositorio:
   ```bash
   git clone https://github.com/alonsogc96/star-wars-api.git
   ```

2. Navega al directorio del proyecto:
   ```bash
   cd star-wars-api
   ```

3. Instala las dependencias:
   ```bash
   npm install
   # o con yarn
   yarn install
   ```

## Despliegue

Este proyecto utiliza **Serverless Framework** para desplegar en AWS Lambda.

1. Asegúrate de tener AWS CLI configurado en tu máquina.
2. Para desplegar en AWS, utiliza el siguiente comando:

   ```bash
   npm run deploy
   ```

## Uso en desarrollo

Para ejecutar el proyecto de manera local, puedes usar el siguiente comando con **Serverless Offline**:

```bash
npm run start
```

Esto levantará el servidor en `http://localhost:3000`.

## Endpoints

### **GET** `/api/myapi/personajes/:id`
Obtiene un personaje desde **MyAPI** basado en el UUID proporcionado.

- **Parámetros**:
  - `id` (required): UUID del personaje.
- **Respuesta exitosa**:
  - **Código de estado**: `200 OK`
  - **Cuerpo**: Información del personaje en formato JSON.
- **Respuesta de error**:
  - **Código de estado**: `404 Not Found` si no se encuentra el personaje.

### **GET** `/api/swapi/personajes/:id`
Obtiene un personaje desde **SWAPI** basado en el ID proporcionado.

- **Parámetros**:
  - `id` (required): ID del personaje.
- **Respuesta exitosa**:
  - **Código de estado**: `200 OK`
  - **Cuerpo**: Información del personaje en formato JSON.
- **Respuesta de error**:
  - **Código de estado**: `404 Not Found` si no se encuentra el personaje.

### **GET** `/api/myapi/personajes`
Obtiene todos los personajes desde **MyAPI**. También soporta consultas por nombre.

- **Parámetro de consulta (Query Param)**:
  - `nombre` (optional): Nombre del personaje.
- **Respuesta exitosa**:
  - **Código de estado**: `200 OK`
  - **Cuerpo**: Lista de personajes en formato JSON.

### **GET** `/api/swapi/personajes`
Obtiene todos los personajes desde **SWAPI**. También soporta consultas por nombre.

- **Respuesta exitosa**:
  - **Código de estado**: `200 OK`
  - **Cuerpo**: Lista de personajes en formato JSON.

### **POST** `/api/myapi/personajes`
Crea un nuevo personaje en **MyAPI**. Si se proporciona un nombre registrado en SWAPI, toma el resto de datos de dicha fuente, facilitando el proceso de creación. Caso contrario se debe proporcionar todos los datos

- **Cuerpo de la solicitud**:
  - **Ejemplo**:
    ```json
    {
      "nombre": "Luke Skywalker",
    }
    ```
- **Respuesta exitosa**:
  - **Código de estado**: `201 Created`
  - **Cuerpo**: Información del personaje creado.
- **Respuesta de error**:
  - **Código de estado**: `400 Bad Request` si los datos proporcionados son inválidos.

## Pruebas

Para ejecutar las pruebas unitarias de la API con **Jest**, puedes utilizar el comando:

```bash
npm run test

```

## Licencia

Este proyecto está licenciado bajo la **MIT License** - consulta el archivo [LICENSE](./LICENSE) para más detalles.

---

## Notas adicionales

- Este proyecto utiliza **Express** para manejar las rutas HTTP y **DynamoDB** para almacenar los personajes.
- El código está estructurado con una arquitectura modular, lo que permite la fácil adición de nuevas rutas y servicios.
- La base de datos DynamoDB almacena los personajes que se crean a través del endpoint **POST** `/myapi/personajes`.

---

¡Gracias por usar Star Wars API! Que la Fuerza te acompañe.

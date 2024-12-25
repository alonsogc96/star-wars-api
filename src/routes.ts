import { Router } from 'express';
import { getCharacterFromMyApi } from './controllers/getControllerMyApi';
import { getCharacterFromSwapi } from './controllers/getControllerSwapi';
import { createCharacter } from './controllers/postController';

const router = Router();

// Ruta para obtener un personaje por ID desde MyAPI
router.get('/myapi/personajes/:id', getCharacterFromMyApi); 

// Ruta para obtener un personaje por ID desde SWAPI
router.get('/swapi/personajes/:id', getCharacterFromSwapi); 

// Ruta para obtener personajes sin ID (devuelve todos los personajes)
router.get('/myapi/personajes', getCharacterFromMyApi); 
router.get('/swapi/personajes', getCharacterFromSwapi); 

// Ruta para crear un nuevo personaje
router.post('/myapi/personajes', createCharacter);

export default router;

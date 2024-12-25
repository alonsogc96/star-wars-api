import { Request, Response } from 'express';
import { getCharacterFromSwapiService } from '../services/characterService'; // Asegúrate de que la función esté correctamente importada

// Función para obtener un personaje desde SWAPI usando Express
export const getCharacterFromSwapi = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // id desde la ruta
  const { nombre } = req.query; // nombre desde los parámetros de query

  // Lógica para manejar las diferentes formas de obtener datos desde SWAPI
  try {
    if (id) {
      // Validar que el id sea un número entero
      if (isNaN(Number(id))) {
        res.status(400).json({ message: 'El ID debe ser un número entero.' });
        return;
      }
      // Llamada al servicio para obtener el personaje por id
      const result = await getCharacterFromSwapiService(Number(id));
      if (result.statusCode === 404) {
        res.status(404).json({ message: 'Personaje no encontrado en Swapi.' });
        return;
      }
      res.status(200).json(result); // Respuesta con el personaje encontrado
      return;
    }

    if (nombre) {
      // Llamada al servicio para obtener el personaje por nombre
      const result = await getCharacterFromSwapiService(undefined, nombre as string);
      if (result === null) {
         res.status(404).json({ message: 'Personaje no encontrado' });
         return;
      }
      res.status(200).json(result); // Respuesta con el personaje encontrado
      return;
    }

    // Si no se pasa ni id ni nombre, obtener todos los personajes
    const result = await getCharacterFromSwapiService();
    if (result === null) {
      res.status(404).json({ message: 'No se encontraron personajes' });
      return;
    }
    res.status(200).json(result); // Respuesta con todos los personajes
  } catch (error) {
    console.error('Error al obtener el personaje desde SWAPI:', error);
    res.status(500).json({ message: 'Error al obtener el personaje desde SWAPI' });
  }
};

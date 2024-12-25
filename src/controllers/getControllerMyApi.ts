import { Request, Response } from 'express';
import { getCharacterService } from '../services/characterService';

// Función para obtener un personaje desde MyAPI
export const getCharacterFromMyApi = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params; // id desde la ruta
  const { nombre } = req.query; // nombre desde los parámetros de query

  try {
    // Llamada sin parámetros (obtiene todos)
    let result = await getCharacterService(); 
    if (id) {
        console.log('id', id);
      if (id.length !== 36) {
        res.status(400).json({ message: 'Se debe proporcionar un UUID válido.' });
        return;
      }
      result = await getCharacterService(id); // Llamada con el id (si es UUID válido)
    }

    if (nombre) {
      result = await getCharacterService(undefined, nombre as string); // Llamada con nombre
    }

    if (result === null) {
      res.status(404).json({ message: 'No se encontró el personaje' }); 
      return;
    }
    // Respuesta exitosa
    JSON.stringify(result);
    res.status(200).json(result);
    
  } catch (error) {
    console.error('Error al obtener el personaje desde MyAPI:', error);
    res.status(500).json({ message: 'Error al obtener el personaje desde MyAPI' });
  }
};

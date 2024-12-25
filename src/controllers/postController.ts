import { Request, Response } from 'express';
import { createCharacterService } from '../services/createCharacterService';
import { Character } from '../models/character';

// Función para crear un personaje usando Express
export const createCharacter = async (req: Request, res: Response): Promise<void> => {
  try {
    // Parseamos el cuerpo de la solicitud (JSON)
    const character: Character = req.body;

    // Llamada al servicio para crear el personaje
    const createdCharacter = await createCharacterService(character);

    // Respuesta exitosa con el personaje creado
    res.status(201).json(createdCharacter); // 201 Created
  } catch (error) {
    console.error('Error al crear personaje:', error);
    
    // Si el error es una instancia de Error, devolvemos el mensaje del error
    if (error instanceof Error) {
      res.status(500).json({ message: error.message });
    } else {
      res.status(500).json({ message: 'Error al crear el personaje' });
    }
  }
};

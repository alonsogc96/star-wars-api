import { v4 as uuidv4 } from 'uuid'; // Para generar un UUID
import { getCharacterFromSWAPI } from '../adapters/swapiAdapter';
import { saveCharacterToDynamoDb, getCharacterFromDynamoDb } from '../adapters/dynamoAdapter';
import { Character } from '../models/character';
import { mapCharacterData } from '../utils/characterMapper';  // Importamos el mapeo

// Función para crear un personaje y guardarlo en DynamoDB
export const createCharacterService = async (characterData: any) => {
  try {
    // Se busca el personaje en DynamoDB por nombre
    const characterFromDb = await getCharacterFromDynamoDb(undefined, characterData.nombre);
    // Si el personaje ya existe en DynamoDB, se lanza un error
    if (characterFromDb) {
      throw new Error('El personaje ya existe.');
    }

    // Se busca el personaje en SWAPI por nombre
    const swapiCharacter = await getCharacterFromSWAPI(undefined, characterData.nombre);

    // Si no se encuentra el personaje en SWAPI, se usa un objeto vacío
    const mappedCharacter = mapCharacterData(characterData, swapiCharacter || {});

    const character: Character = {
      id: uuidv4(), 
      creado: new Date().toISOString(), 
      editado: new Date().toISOString(),
      nombre: characterData.nombre, 
      ...mappedCharacter, 
    };

    await saveCharacterToDynamoDb(character);

    return character;
  } catch (error) {
    const errorMessage = (error as any).message;
    throw new Error(`Error al crear el personaje: ${errorMessage}`);
  }
};

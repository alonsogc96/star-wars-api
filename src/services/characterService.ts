import { getCharacterFromSWAPI } from '../adapters/swapiAdapter';
import { getCharacterFromDynamoDb } from '../adapters/dynamoAdapter';

// Función para obtener un personaje desde DynamoDB
export const getCharacterService = async (id?: string, nombre?: string) => {
  // Búsqueda por id
  if (id) {
    const character = await getCharacterFromDynamoDb(id);
    if (!character) {
      return null;
    }
    return character;
  }

  // Búsqueda por nombre
  if (nombre) {
    const characters = await getCharacterFromDynamoDb(undefined, nombre);
    if (!characters || characters.length === 0) {
      return null;
    }
    return characters;
  }
  // Devuelve todos los personajes
  const allCharacters = await getCharacterFromDynamoDb();
  return allCharacters;
};

// Función para obtener un personaje desde SWAPI (tanto por ID como por nombre)
export const getCharacterFromSwapiService = async (id?: number, nombre?: string) => {
  try {
    let character = await getCharacterFromSWAPI();
    console.log('id-test:', id);
    // Búsqueda por id
    if (id) {
      console.log('id:', id);
      character = await getCharacterFromSWAPI(id);
      console.log('character:', character);
    }

    // Búsqueda por nombre
    if (nombre) {
      character = await getCharacterFromSWAPI(undefined, nombre);
    }

    if (character.statusCode===404) {
      return character;
    }
    return character;
  } catch (error) {
    console.error('Error al obtener el personaje por ID:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error al obtener el personaje por ID' }),
    };
  }
};

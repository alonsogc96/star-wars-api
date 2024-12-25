import { createCharacterService } from './../src/services/createCharacterService'; // Ruta a la función que quieres probar
import { getCharacterFromDynamoDb, saveCharacterToDynamoDb } from './../src/adapters/dynamoAdapter'; // Ruta a la función DynamoDB
import { getCharacterFromSWAPI } from './../src/adapters/swapiAdapter'; // Ruta a la función SWAPI
import { mapCharacterData } from './../src/utils/characterMapper'; // Ruta a la función de mapeo
import { v4 as uuidv4 } from 'uuid';

// Mocks
jest.mock('./../src/adapters/dynamoAdapter', () => ({
  getCharacterFromDynamoDb: jest.fn(),
  saveCharacterToDynamoDb: jest.fn(),
}));

jest.mock('./../src/adapters/swapiAdapter', () => ({
  getCharacterFromSWAPI: jest.fn(),
}));

jest.mock('./../src/utils/characterMapper', () => ({
  mapCharacterData: jest.fn(),
}));

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

describe('createCharacterService', () => {
  const mockCharacterData = {
    nombre: 'Luke Skywalker',
    especie: 'Human',
  };

  beforeEach(() => {
    // Limpiar mocks antes de cada prueba
    jest.clearAllMocks();
  });

  it('debería crear un personaje si no existe en DynamoDB y existe en SWAPI', async () => {
    // Preparar los mocks
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValue(null); // No existe en DB
    (getCharacterFromSWAPI as jest.Mock).mockResolvedValue({ nombre: 'Luke Skywalker', especie: 'Human' });
    (mapCharacterData as jest.Mock).mockReturnValue({ especie: 'Human' });
    (uuidv4 as jest.Mock).mockReturnValue('uuid-123');
    (saveCharacterToDynamoDb as jest.Mock).mockResolvedValue(null); // Simula que se guarda exitosamente

    const result = await createCharacterService(mockCharacterData);

    // Aserciones
    expect(getCharacterFromDynamoDb).toHaveBeenCalledWith(undefined, mockCharacterData.nombre);
    expect(getCharacterFromSWAPI).toHaveBeenCalledWith(undefined, mockCharacterData.nombre);
    expect(mapCharacterData).toHaveBeenCalledWith(mockCharacterData, { nombre: 'Luke Skywalker', especie: 'Human' });
    expect(saveCharacterToDynamoDb).toHaveBeenCalledWith({
      id: 'uuid-123',
      creado: expect.any(String),
      editado: expect.any(String),
      nombre: 'Luke Skywalker',
      especie: 'Human',
    });

    expect(result).toEqual({
      id: 'uuid-123',
      creado: expect.any(String),
      editado: expect.any(String),
      nombre: 'Luke Skywalker',
      especie: 'Human',
    });
  });

  it('debería crear un personaje incluso si no se encuentra en SWAPI', async () => {
    // Preparar los mocks
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValue(null); // No existe en DB
    (getCharacterFromSWAPI as jest.Mock).mockResolvedValue(null); // No encontrado en SWAPI
    (uuidv4 as jest.Mock).mockReturnValue('uuid-123');
    (saveCharacterToDynamoDb as jest.Mock).mockResolvedValue(null); // Simula que se guarda exitosamente en DB

    // Llamar al servicio para crear el personaje
    const result = await createCharacterService(mockCharacterData);

    // Aserciones
    expect(getCharacterFromDynamoDb).toHaveBeenCalledWith(undefined, mockCharacterData.nombre); // Llamada a DynamoDB
    expect(getCharacterFromSWAPI).toHaveBeenCalledWith(undefined, mockCharacterData.nombre); // Llamada a SWAPI
    expect(saveCharacterToDynamoDb).toHaveBeenCalledWith({
      id: 'uuid-123',
      creado: expect.any(String),
      editado: expect.any(String),
      nombre: 'Luke Skywalker',
      especie: 'Human',
    });

    // Verifica que el personaje se haya creado con los datos
    expect(result).toEqual({
      id: 'uuid-123',
      creado: expect.any(String),
      editado: expect.any(String),
      nombre: 'Luke Skywalker',
      especie: 'Human',
    });
  });

  it('debería lanzar un error si el personaje ya existe en DynamoDB', async () => {
    // Preparar los mocks
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValue({ nombre: 'Luke Skywalker' }); // Ya existe en DB

    await expect(createCharacterService(mockCharacterData)).rejects.toThrowError('El personaje ya existe.');
    expect(getCharacterFromDynamoDb).toHaveBeenCalledWith(undefined, mockCharacterData.nombre);
    expect(getCharacterFromSWAPI).not.toHaveBeenCalled(); // No debería llamarse a SWAPI
  });


  it('debería lanzar un error genérico si ocurre un fallo inesperado', async () => {
    // Preparar los mocks
    (getCharacterFromDynamoDb as jest.Mock).mockRejectedValue(new Error('Database error'));

    await expect(createCharacterService(mockCharacterData)).rejects.toThrowError('Error al crear el personaje: Database error');
  });
});

import { getCharacterService, getCharacterFromSwapiService } from '../src/services/characterService';  // Importa la función que vas a probar
import { getCharacterFromDynamoDb } from '../src/adapters/dynamoAdapter'; 

// Mockear las funciones de los adaptadores
jest.mock('../src/adapters/dynamoAdapter');
jest.mock('../src/adapters/swapiAdapter');

describe('Pruebas para getCharacterService', () => {
  afterEach(() => {
    jest.clearAllMocks();  // Limpiar mocks después de cada prueba
  });

  it('debería devolver un personaje por ID desde DynamoDB', async () => {
    // Simulamos que getCharacterFromDynamoDb devuelve un personaje con ID '1'
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValueOnce({ id: '1', nombre: 'Luke Skywalker' });

    const result = await getCharacterService('1');

    expect(result).toEqual({ id: '1', nombre: 'Luke Skywalker' });
    expect(getCharacterFromDynamoDb).toHaveBeenCalledWith('1');  // Verifica que se haya llamado con el ID correcto
  });

  it('debería devolver un personaje por nombre desde DynamoDB', async () => {
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValueOnce([{ id: '1', nombre: 'Luke Skywalker' }]);

    const result = await getCharacterService(undefined, 'Luke Skywalker');

    expect(result).toEqual([{ id: '1', nombre: 'Luke Skywalker' }]);
    expect(getCharacterFromDynamoDb).toHaveBeenCalledWith(undefined, 'Luke Skywalker');  // Verifica que se haya llamado con el nombre correcto
  });

  it('debería devolver todos los personajes desde DynamoDB', async () => {
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValueOnce([
      { id: '1', nombre: 'Luke Skywalker' },
      { id: '2', nombre: 'Darth Vader' }
    ]);

    const result = await getCharacterService();

    expect(result).toEqual([
      { id: '1', nombre: 'Luke Skywalker' },
      { id: '2', nombre: 'Darth Vader' }
    ]);
    expect(getCharacterFromDynamoDb).toHaveBeenCalledWith();  // Verifica que se haya llamado sin parámetros
  });

  it('debería devolver null si no se encuentra un personaje por ID', async () => {
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValueOnce(null);

    const result = await getCharacterService('nonexistent-id');

    expect(result).toBeNull();
  });

  it('debería devolver null si no se encuentra un personaje por nombre', async () => {
    (getCharacterFromDynamoDb as jest.Mock).mockResolvedValueOnce([]);

    const result = await getCharacterService(undefined, 'nonexistent name');

    expect(result).toBeNull();
  });
});
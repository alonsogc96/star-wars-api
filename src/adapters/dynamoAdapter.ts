import { DynamoDBClient } from "@aws-sdk/client-dynamodb"; // Cliente principal de DynamoDB
import { DynamoDBDocumentClient, GetCommand, PutCommand, QueryCommand, ScanCommand } from "@aws-sdk/lib-dynamodb"; // DocumentClient

// Crear el cliente DynamoDB
const client = new DynamoDBClient({});
const dynamoDb = DynamoDBDocumentClient.from(client);

// Nombre de la tabla
const tableName = process.env.DYNAMODB_TABLE!;

// Función para guardar un personaje en DynamoDB
export const saveCharacterToDynamoDb = async (character: any) => {
  const params = {
    TableName: tableName,
    Item: character,
  };

  try {
    await dynamoDb.send(new PutCommand(params));
  } catch (error) {
    console.error('Error al obtener los personajes de DynamoDB:', error);
    throw new Error("Error al guardar personaje en DynamoDB");
  }
};

// Función para buscar personaje por ID o nombre en DynamoDB
export const getCharacterFromDynamoDb = async (id?: string, nombre?: string) => {
  try {
    if (id) {
      // Si se pasa un 'id', se busca el personaje por id (clave primaria)
      const result = await dynamoDb.send(new GetCommand({
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          id: id,
        },
      }));

      if (result.Item) {
        return result.Item;  // Devuelve el personaje encontrado
      } else {
        return null;  // No se encontró el personaje por id
      }
    }

    if (nombre) {
      // Si se pasa un 'nombre', se busca por nombre usando el índice global secundario
      const result = await dynamoDb.send(new QueryCommand({
        TableName: process.env.DYNAMODB_TABLE,
        IndexName: 'NombreIndex', 
        KeyConditionExpression: "nombre = :nombre",
        ExpressionAttributeValues: {
          ":nombre": nombre,
        },
      }));

      if (result.Items && result.Items.length > 0) {
        return result.Items; 
      } else {
        return null;  
      }
    }

    // Devuelve todos los personajes si no se pasa ni 'id' ni 'nombre'
    const result = await dynamoDb.send(new ScanCommand({
      TableName: process.env.DYNAMODB_TABLE,
    }));

    return result.Items || [];  // Devuelve todos los personajes
  } catch (error) {
    console.error('Error al obtener personajes desde DynamoDB:', error);
    throw new Error('Error al obtener personajes desde DynamoDB');
  }
};

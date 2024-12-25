import { Character } from '../models/character';

// Función para mapear los datos de SWAPI y la petición
export const mapCharacterData = (characterData: any, swapiCharacter: any): Partial<Character> => {
  const mappedCharacter: Partial<Character> = {};

  const modelFields: (keyof Character)[] = [
    'altura', 'peso', 'colorCabello', 'colorPiel', 'colorOjos', 'añoNacimiento', 'genero',
    'planetaOrigen', 'peliculas', 'especies', 'vehiculos', 'navesEstelares'
  ];

  modelFields.forEach(field => {
    if (characterData[field]) {
      mappedCharacter[field] = characterData[field];
    } 
    else if (swapiCharacter[field] !== undefined) {
      mappedCharacter[field] = swapiCharacter[field] || undefined;
    } 
    else {
      mappedCharacter[field] = undefined; 
    }
  });

  return mappedCharacter;
};

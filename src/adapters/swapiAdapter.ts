import axios from 'axios';

const SWAPI_URL = process.env.SWAPI_URL!;

const getCharacterNameFromUrl = async (url: string): Promise<string> => {
  const response = await axios.get(url);
  return response.data.name || response.data.title; // Devuelve el nombre o título del recurso
};

// Función para obtener un personaje desde SWAPI
export const getCharacterFromSWAPI = async (id?: number, nombre?: string) => {
  try {
    let url = SWAPI_URL;
    console.log('id-swapi:', id);
    if (id) {
      console.log('id-ifswapi:', id);
      url += `${id}`;
    } else if (nombre) {
      url += `?search=${nombre}`;
    }

    const response = await axios.get(url);
    const data = response.data;

    if (id || (nombre && data.count === 1)) {
      const character = id ? data : data.results[0];
      const homeworldName = await getCharacterNameFromUrl(character.homeworld);
      const filmsNames = await Promise.all(character.films.map(getCharacterNameFromUrl));
      const speciesNames = await Promise.all(character.species.map(getCharacterNameFromUrl));
      const vehiclesNames = await Promise.all(character.vehicles.map(getCharacterNameFromUrl));
      const starshipsNames = await Promise.all(character.starships.map(getCharacterNameFromUrl));

      return {
        nombre: character.name,
        altura: character.height,
        peso: character.mass,
        color_cabello: character.hair_color,
        color_piel: character.skin_color,
        color_ojos: character.eye_color,
        año_nacimiento: character.birth_year,
        genero: character.gender,
        planeta_origen: homeworldName, // Nombre del planeta
        peliculas: filmsNames, // Nombres de las películas
        especies: speciesNames, // Nombres de las especies
        vehiculos: vehiclesNames, // Nombres de los vehículos
        naves_estelares: starshipsNames, // Nombres de las naves estelares
        creado: character.created, // Fecha de creación de SWAPI
        editado: character.edited, // Fecha de edición de SWAPI
        url: character.url, // URL original del personaje
      };
    } else {
      return data.results;
    }
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      return {
        statusCode: 404,
        body: { message: 'Personaje no encontrado en SWAPI' },
      };
    }
    throw new Error('Error al obtener datos de SWAPI');
  }
};
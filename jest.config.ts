import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest', // Esto indica que estamos usando ts-jest para compilar TypeScript
  testEnvironment: 'node', // El entorno de prueba será Node.js
  globals: {
    'ts-jest': {
      isolatedModules: true, // Esto permite compilar módulos de forma aislada, lo que acelera el proceso
    },
  },
  moduleFileExtensions: ['ts', 'js', 'json'], // Permite usar archivos .ts, .js y .json
  transform: {
    '^.+\\.ts$': 'ts-jest', // Transforma archivos TypeScript con ts-jest
  },
  setupFilesAfterEnv: [], // Si tienes configuraciones adicionales para las pruebas
  testPathIgnorePatterns: ['/node_modules/', '/dist/'], // Ignora archivos de node_modules y dist
};

export default config;

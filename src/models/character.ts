import { IsString, IsOptional, IsArray, IsUrl } from 'class-validator';

export class Character {

  @IsString()
  id?: string;

  @IsString()
  nombre!: string;

  @IsString()
  altura?: string;

  @IsString()
  peso?: string;

  @IsString()
  colorCabello?: string;

  @IsString()
  colorPiel?: string;
  
  @IsString()
  colorOjos?: string;
  
  @IsString()
  añoNacimiento?: string;
  
  @IsString()
  genero?: string;
  
  @IsString()
  planetaOrigen?: string;
  
  @IsArray()
  @IsString({ each: true })
  peliculas?: string[];
  
  @IsArray()
  @IsString({ each: true })
  especies?: string[];
  
  @IsArray()
  @IsString({ each: true })
  vehiculos?: string[];
  
  @IsArray()
  @IsString({ each: true })
  navesEstelares?: string[];
  
  @IsString()
  creado?: string;

  @IsString()
  editado?: string;
}

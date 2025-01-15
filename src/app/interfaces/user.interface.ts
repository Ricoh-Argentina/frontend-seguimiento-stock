export interface UserInterface {
    usuario:           string;
    password:          string;
    nombre_y_apellido: string;
    rol:               string;
    imagen:            string;
    email:             string;
  }

  export interface UserResponse {
  usuarios:         Usuario[];
  cantidad_paginas: number;
  numero_pagina:    number;
  longitud_pagina:  number;
  registro_inicio:  number;
  total_registros:  number;
}

export interface Usuario {
  nombre_y_apellido: string;
  usuario:           string;
  fecha_creacion:    Date;
  estado:            boolean;
  imagen:            string;
  email:             string;
  rol:               string;
}

export interface Rol {
  id:          string;
  nombre_rol:  string;
  descripcion: string;
  nivel:       number;
}

export interface UserSearch {
  termino:  string;
  longitud_pagina:  number;
  numero_pagina:    number;
}

export interface UserUpdateInterface {
  password:          string;
  nombre_y_apellido: string;
  rol:               string;
  imagen:            string;
  email:             string;
}

export interface UserUpdateResponse {
  nombre_y_apellido: string;
  usuario:           string;
  fecha_creacion:    Date;
  estado:            boolean;
  imagen:            string;
  email:             string;
  rol:               string;
  password:          string;
}

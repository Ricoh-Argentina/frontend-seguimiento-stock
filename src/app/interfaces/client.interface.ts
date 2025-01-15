export interface ClientResult {
    nombre_cliente: string;
    fecha_creacion: Date;
    imagen:         string;
}

export interface Client {
    clientes:         Cliente[];
    cantidad_paginas: number;
    registro_inicio:  number;
    total_registros:  number;
    numero_pagina:    number;
    longitud_pagina:  number;
}

export interface Cliente {
    nombre_cliente: string;
    fecha_creacion: Date;
    imagen:         Imagen;
}

export enum Imagen {
    DefaultPNG = "default.png",
}


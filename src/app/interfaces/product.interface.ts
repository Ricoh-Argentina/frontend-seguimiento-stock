export interface ProductsResult {
    cliente:  string;
    producto: string;
    imagenes: string;
    hojas:    string;
}

export interface ProductsSearch {
    cliente:  string;
    producto: string;
    fecha_inicio: string;
    fecha_fin:    string;
    tipo: string;
    formato: string;
}

export interface Product {
    productos:        Producto[];
    cantidad_paginas: number;
    registro_inicio:  number;
    total_registros:  number;
    numero_pagina:    number;
    longitud_pagina:  number;
}

export interface Producto {
    nombre_producto: string;
    modo_impresion:  ModoImpresion;
    tam_papel:       TamPapel;
}

export enum ModoImpresion {
    Simplex = "simplex",
}

export enum TamPapel {
    A4 = "A4",
}

export interface GeneratorQR {
    fecha_creacion:   string;
    articulo:         string;
    numeroSecuencia:  number;
    cantidad:         number;
    peso:             number;
    descripcion:      string;
}

export interface GetSecuencia {
    tipo:  string;
  }


  




export interface ArticleResponse {
    articulos:        Articulo[];
    cantidad_paginas: number;
    registro_inicio:  number;
    total_registros:  number;
    numero_pagina:    number;
    longitud_pagina:  number;
}

export interface Articulo {
    codigo:      string;
    descripcion: string;
    unidad:      string;
    cantidad:    number;
    proveedores: Proveedores[];
}

export interface Proveedores {
    nombre_proveedor: string;
}


export interface NewArticle {
    codigo:      string;
    descripcion: string;
    unidad:      string;
    proveedores: string[];
    cantidad:    number;
}

export interface ArticleUpdateInterface {
    descripcion: string;
    unidad:      string;
    proveedores: string[];
    cantidad:    number;
}

export interface NewOrder {
    fecha_movimiento: string;
    codigo_articulo:  string;
    nombre_proveedor: string;
    tipo_movimiento:  string;
    cantidad:         number;
    numero_remito:    string;
}

export interface OrdersSearch {
    longitud_pagina:    number;
    numero_pagina:      number;
    fecha_inicio:       string;
    fecha_fin:          string;
    nombre_proveedor:   string;
    codigo_articulo:    string;
    tipo_movimiento:    string;
    nombre_usuario:     string;
    numero_orden:       number;
    numero_remito:      string;
    formato:            string;
}

export interface OrderResponse {
    ordenes:          Ordenes[];
    cantidad_paginas: number;
    longitud_pagina:  number;
    numero_pagina:    number;
    registro_inicio:  number;
    total_registros:  number;
}

export interface Ordenes {
    cantidad:         number;
    codigo_articulo:  string;
    fecha_movimiento: string;
    nombre_proveedor: string;
    tipo_movimiento:  string;
    nombre_usuario:   string;
    numero_orden:     number;
    numero_remito:    string;
}


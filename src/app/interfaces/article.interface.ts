export interface ArticleSearch {
    termino:  string;
    longitud_pagina:  number;
    numero_pagina:    number;
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
    codigo:         string;
    descripcion:    string;
    unidad:         string;
    tipo_articulo:  string;
    esta_activo:    boolean;
    cantidad_total: number;
    proveedores:    Proveedores[];
}

export interface Proveedores {
    nombre_proveedor: string;
    cantidad:         number;
    esta_activo:      boolean;
}

export interface NewArticle {
    codigo:      string;
    descripcion: string;
    unidad:      string;
    proveedores: string[];
    tipo_articulo: string;
}

export interface ArticleUpdateInterface {
    descripcion: string;
    unidad:      string;
    proveedores: string[];
    tipo_articulo: string;
    esta_activo:      boolean;
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


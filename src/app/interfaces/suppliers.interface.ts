export interface SupplierSearch {
    termino:  string;
    longitud_pagina:  number;
    numero_pagina:    number;
  }

export interface SuppliersResponse {
    proveedores:      Proveedores[];
    cantidad_paginas: number;
    registro_inicio:  number;
    total_registros:  number;
    numero_pagina:    number;
    longitud_pagina:  number;
}

export interface Proveedores {
    nombre_proveedor: string;
    fecha_creacion:   Date;
    estado:           boolean;
}

export interface NewSupplier {
    nombre_proveedor: string;
}

export interface DeleteSupplier {
    nombre_proveedor: string;
}

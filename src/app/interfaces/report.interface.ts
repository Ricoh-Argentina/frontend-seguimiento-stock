export interface ReportSearch {
    cliente:  string;
    producto: string;
    fecha_inicio: string;
    fecha_fin:    string;
    tipo: string;
    formato: string;
    longitud_pagina: number;
    numero_pagina: number;
}

export interface ClientReportResult {
    resultadoPorCliente: ResultadoPorCliente[];
    cantidad_paginas:    number;
    longitud_pagina:     number;
    numero_pagina:       number;
    registro_inicio:     number;
    total_registros:     number;
}

export interface ResultadoPorCliente {
    cliente:  string;
    imagenes: string;
    hojas:    string;
}

export interface ProductReportResult {
    resultadoPorProductos: ResultadoPorProducto[];
    cantidad_paginas:      number;
    longitud_pagina:       number;
    numero_pagina:         number;
    registro_inicio:       number;
    total_registros:       number;
}

export interface ResultadoPorProducto {
    cliente:  string;
    producto: string;
    imagenes: string;
    hojas:    string;
}

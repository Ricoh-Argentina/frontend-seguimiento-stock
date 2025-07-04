export interface ReportSearch {
    cliente: string;
    producto: string;
    fecha_inicio: string;
    fecha_fin: string;
    tipo: string;
    formato: string;
    longitud_pagina: number;
    numero_pagina: number;
}

export interface MinimalSearch {
    longitud_pagina: number;
    numero_pagina: number;
}

export interface ClientReportResult {
    resultadoPorCliente: ResultadoPorCliente[];
    cantidad_paginas: number;
    longitud_pagina: number;
    numero_pagina: number;
    registro_inicio: number;
    total_registros: number;
}

export interface ResultadoPorCliente {
    cliente: string;
    imagenes: string;
    hojas: string;
}

export interface ProductReportResult {
    resultadoPorProductos: ResultadoPorProducto[];
    cantidad_paginas: number;
    longitud_pagina: number;
    numero_pagina: number;
    registro_inicio: number;
    total_registros: number;
}

export interface ResultadoPorProducto {
    cliente: string;
    producto: string;
    imagenes: string;
    hojas: string;
}

export interface ResultadoPorEjecucion {
    ejecuciones: Ejecucion[];
    cantidad_paginas: number;
    registro_inicio: number;
    total_registros: number;
    numero_pagina: number;
    longitud_pagina: number;
}

export interface Ejecucion {
    tipo_reporte: string;
    periodicidad: string;
    detalle: string;
    resultado: string;
    destinatarios: string;
    fecha_hora_ejecucion: Date;
}

export interface Programacion {
    codigo:        number;
    periodicidad:  string;
    tipo_reporte:  string;
    destinatarios: string[];
}

export interface TipoReporte {
    codigo:      number;
    descripcion: string;
}

export interface UpdateDestinatariosDTO {
    destinatarios: string[];
}



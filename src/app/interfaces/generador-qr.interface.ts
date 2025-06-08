export interface GeneratorQR {
    codigo_articulo:  string;
    nombre_proveedor: string;
    fecha:            string;
    numero_secuencia: number;
    cantidad:         number;
    peso:             number;
    descripcion:      string;
}

export interface GetSecuencia {
    tipo:  string;
  }

export interface QrResponse {
    cantidad:         number;
    descripcion:      string;
    fecha:            string;
    peso:             number;
    numero_secuencia: number;
    qr:               string;
}

export interface QrResponseFile {
    result: QrResponse[];
    errors: any[];
}

export interface QrRegistrar {
    qr: string;
}


export interface GeneratorQR {
    tipo:         string;
    fecha:            string;
    numero_secuencia:  number;
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
    tipo:             string;
    numero_secuencia: number;
    qr:               string;
}

export interface TaskResult {
    tareas:           Tarea[];
    total_registros:  number;
    numero_pagina:    number;
    longitud_pagina:  number;
    registro_inicio:  number;
    cantidad_paginas: number;
}

export interface Tarea {
    cliente:        string;
    cantidad:       string;
    nombre_tarea:   string;
    producto:       string;
    unidad:         string;
    fecha_creacion: Date;
}

export class User {
    constructor(
        public nombre_y_apellido: string,
        public usuario: string,
        public fecha_creacion: string,
        public estado: boolean,
        public rol: string, 
        public password: string, 
        public imagen: string,
        public email: string,
        public id: string
    ) { };
}
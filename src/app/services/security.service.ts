import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
  })
export class SecurityService {
    public url: string;
    private _usuario!: User;
    private _token!: string;

    constructor(
        public _http: HttpClient,
        private _router: Router
    ) {
        this.url = Global.url;
    }


    public get usuario(): User {
        if (this._usuario != null) {
            return this._usuario;
        } else {
            if (sessionStorage.getItem("usuario") != null) {
                const userJson = sessionStorage.getItem('usuario');
                this._usuario = userJson !== null ? JSON.parse(userJson) as User: new User("","","",false,"","","","","");
            }
        }
        return this._usuario;
    }

    saveUser(usuario: User): void {
        if (usuario) {
            this._usuario = new User("", "", "", false, "", "", "", "", "");
            this._usuario.nombre_y_apellido = usuario.nombre_y_apellido;
            this._usuario.usuario = usuario.usuario;
            this._usuario.estado = usuario.estado;
            this._usuario.rol = usuario.rol;
            this._usuario.imagen = usuario.imagen;
            this._usuario.id = usuario.id;
            sessionStorage.setItem("usuario", JSON.stringify(this._usuario));
        }

    }

    saveToken(token: string): void {
        if (token) {
            this._token = token
            sessionStorage.setItem("token", this._token);
        }
    }

    /*Metodo utilizado para revisar si el usuario esta autenticado o no */
    isAuthenticated():boolean{
        let payload = this.obtenerPayloadToken(this.token);
        if(payload != undefined && payload!="" && payload.id && payload.id.length > 0){
            return false;  //////CAMBIAR ESTO a TRUE para permitir que este logueado
        }
        return false;
    }
    
    obtenerPayloadToken(token: string): any {
        if (token != null) {
            let payload = JSON.parse(window.atob(token.split(".")[1]));
            return payload;
        }
        return null;
    }


    /*********************************************************************************************************************/
    public get token(): string {
        if (this._token != null) {
            return this._token;
        } else {
            //console.log("Entre el get token igual a null");
            if (sessionStorage.getItem("token") != null) {
                //console.log("Entre en sessionstorage distinto de null");
                const tokenJson = sessionStorage.getItem("token");
                //console.log("token tiene ",tokenJson);
                this._token = tokenJson !== null ? sessionStorage.getItem("token") as string: "";
            }
        }
        return this._token;
    }


    private isNoAutorizado(e: any): boolean {
        //console.log("Entre en is");
        if (e.status == 400 || e.status == 401 || e.status == 403 || e.status == 500) {
            //alert("Usuario o Password incorrecta");
            this._router.navigateByUrl('/');
            return true;
        }
        return false;
    }



    logout(): void{
        this._token!=null;
        this._usuario!=null;
        //sessionStorage.clear();
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("usuario");
    }
}
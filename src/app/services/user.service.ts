import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { UserInterface } from "../interfaces/user.interface";
import { UserResponse, Usuario, UserSearch, UserUpdateResponse, UserUpdateInterface } from "../interfaces/user.interface";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.service";
import { DeleteComponent } from "../administration/users/delete/delete.component";

@Injectable({
    providedIn: 'root'
  })
export class UserService {
    public url: string;
    private _usuario!: User;
    private httpHeaders = new HttpHeaders().set('content-type', 'application/json');
    
    constructor(
        public _http: HttpClient,
        private _router: Router,
        private _securityService: SecurityService
    ) {
        this.url = Global.url;
    }

    private agregarAuthorizationHeader(){
        var token=this._securityService.token;
        if(token!=null){
            return this.httpHeaders.append('Authorization', 'Bearer ' + token);
        }
        return this.httpHeaders;
    }
    
    guardarUsuario(jwt: string): void {
        var payload = this._securityService.obtenerPayloadToken(jwt);
        if (payload) {
            this._usuario = new User("", "", "", false, "", "", "", "", "");
            this._usuario.nombre_y_apellido = payload.nombre_y_apellido;
            this._usuario.usuario = payload.usuario;
            this._usuario.estado = payload.estado;
            this._usuario.rol = payload.rol;
            this._usuario.imagen = payload.imagen;
            this._usuario.id = payload.id;
            sessionStorage.setItem("usuario", JSON.stringify(this._usuario));
        }
    }
    
    loginUser(loginData: any): Observable<any> {
        let parametros = JSON.stringify(loginData);
        
        return this._http.post(this.url + 'auth/login', parametros, { headers: this.agregarAuthorizationHeader() });
    }

    newUser(userData: UserInterface): Observable<Usuario> {

        let parametros = JSON.stringify(userData);
        
        return this._http.post<Usuario>(this.url + 'usuarios', parametros, { headers: this.agregarAuthorizationHeader() });
    }

    updateUser(userData: UserUpdateInterface, user: string): Observable<UserUpdateResponse> {
        let parametros;

        if(userData.password.length>5){
            parametros = JSON.stringify(userData);
        }else{
            let {password, ...userDataNew} = userData;
            parametros = JSON.stringify(userDataNew);
        }
        
        return this._http.patch<UserUpdateResponse>(this.url + 'usuarios/' + user, parametros, { headers: this.agregarAuthorizationHeader() });
    }

    getUsers(bodydata: UserSearch): Observable<UserResponse>{
        let find = "usuarios?";
        if(bodydata.termino){
            find = find + "termino=" + bodydata.termino + "&";
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }
        return this._http.get<UserResponse>(this.url+find, {headers: this.agregarAuthorizationHeader()});
    }

    deleteUser(user: string): Observable<any>{
    
        return this._http.delete(this.url+'usuarios/'+ user, {headers: this.agregarAuthorizationHeader()});
    }
}
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.service";
import { TaskResult } from "../interfaces/tareas.interface";
import { TaskSearch } from "../interfaces/task-search.interface";
import { Client } from "../interfaces/client.interface";
import { Product } from "../interfaces/product.interface";
import { Cliente } from "../interfaces/client.interface";

@Injectable({
    providedIn: 'root'
  })
export class TaskListService {
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
    
    getTasksList(bodydata: TaskSearch): Observable<TaskResult>{

        let find = "tareas?";
        if(bodydata.cliente){
            find = find + "cliente=" + bodydata.cliente + "&";
        }
        if(bodydata.producto){
            find = find + "producto=" + bodydata.producto + "&";
        }
        if(bodydata.fecha_inicio){
            find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
        }
        if(bodydata.fecha_fin){
            find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }
    
        return this._http.get<TaskResult>(this.url+ find, {headers: this.agregarAuthorizationHeader()});

        /*return this._http.get<TaskResult>(this.url+ "tareas", {
            params: new HttpParams()
            .set('cliente', bodydata.cliente)
            .set('producto', bodydata.producto)
            .set('fecha_inicio', bodydata.fecha_inicio)
            .set('fecha_fin', bodydata.fecha_fin)
            .set('longitud_pagina', bodydata.longitud_pagina)
            .set('numero_pagina', bodydata.numero_pagina),
            headers: this.agregarAuthorizationHeader()
        });*/
    }

    getTasksListFilter(bodydata: TaskSearch): Observable<TaskResult>{
        let find = "tareas?";
        if(bodydata.cliente){
            find = find + "cliente=" + bodydata.cliente + "&";
        }
        if(bodydata.producto){
            find = find + "producto=" + bodydata.producto + "&";
        }
        if(bodydata.fecha_inicio){
            find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
        }
        if(bodydata.fecha_fin){
            find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
        }
        if(bodydata.longitud_pagina){
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if(bodydata.numero_pagina){
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }

        //console.log(this.url+ find);
        return this._http.get<TaskResult>(this.url+ find, {headers: this.agregarAuthorizationHeader()});
    }

    getClients(): Observable<Client>{

        return this._http.get<Client>(this.url+ 'clientes', {headers: this.agregarAuthorizationHeader()});

    }

    getProducts(cliente: string): Observable<Product>{

        //return this._http.get<Product[]>(this.url+ 'productos', {headers: this.agregarAuthorizationHeader()});
        return this._http.get<Product>(this.url+ "productos", {
            params: new HttpParams()
            .set('cliente', cliente),
            headers: this.agregarAuthorizationHeader()
        });

    }

    /**************************************************************************************************************/
    
}
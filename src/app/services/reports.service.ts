import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { map, Observable, tap, throwError } from 'rxjs';
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.service";
import { TaskResult } from "../interfaces/tareas.interface";
import { TaskSearch } from "../interfaces/task-search.interface";
import { Client } from "../interfaces/client.interface";
import { Product, ProductsSearch } from "../interfaces/product.interface";
import { ProductsResult } from "../interfaces/product.interface";
import { MinimalSearch, Programacion, ReportSearch, ResultadoPorEjecucion, UpdateDestinatariosDTO } from "../interfaces/report.interface";
import { ClientReportResult } from "../interfaces/report.interface";
import { ProductReportResult } from "../interfaces/report.interface";

@Injectable({
    providedIn: 'root'
})
export class ReportsService {
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

    private agregarAuthorizationHeader() {
        var token = this._securityService.token;
        if (token != null) {
            return this.httpHeaders.append('Authorization', 'Bearer ' + token);
        }
        return this.httpHeaders;
    }

    getClients(): Observable<Client> {

        return this._http.get<Client>(this.url + 'clientes', { headers: this.agregarAuthorizationHeader() });

    }

    getProducts(cliente: string): Observable<Product> {

        //return this._http.get<Product[]>(this.url+ 'productos', {headers: this.agregarAuthorizationHeader()});
        return this._http.get<Product>(this.url + "productos", {
            params: new HttpParams()
                .set('cliente', cliente),
            headers: this.agregarAuthorizationHeader()
        });

    }

    getReportsList(bodydata: ReportSearch): Observable<ClientReportResult> {

        let find = "reportes?";
        if (bodydata.cliente) {
            find = find + "cliente=" + bodydata.cliente + "&";
        }
        if (bodydata.producto) {
            find = find + "producto=" + bodydata.producto + "&";
        }
        if (bodydata.fecha_inicio) {
            find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
        }
        if (bodydata.fecha_fin) {
            find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
        }
        if (bodydata.tipo) {
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if (bodydata.formato) {
            find = find + "formato=" + bodydata.formato + "&";;
        }
        if (bodydata.longitud_pagina) {
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";;
        }
        if (bodydata.numero_pagina) {
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }

        return this._http.get<ClientReportResult>(this.url + find, { headers: this.agregarAuthorizationHeader() });

    }

    getReportsListFilter(bodydata: ReportSearch): Observable<ClientReportResult> {
        let find = "reportes?";
        if (bodydata.cliente) {
            find = find + "cliente=" + bodydata.cliente + "&";
        }
        if (bodydata.producto) {
            find = find + "producto=" + bodydata.producto + "&";
        }
        if (bodydata.fecha_inicio) {
            find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
        }
        if (bodydata.fecha_fin) {
            find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
        }
        if (bodydata.tipo) {
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if (bodydata.formato) {
            find = find + "formato=" + bodydata.formato + "&";
        }
        if (bodydata.longitud_pagina) {
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if (bodydata.numero_pagina) {
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }


        //console.log(this.url+ find);
        return this._http.get<ClientReportResult>(this.url + find, { headers: this.agregarAuthorizationHeader() });
    }


    getReportsListProduct(bodydata: ReportSearch): Observable<ProductReportResult> {

        let find = "reportes?";
        if (bodydata.cliente) {
            find = find + "cliente=" + bodydata.cliente + "&";
        }
        if (bodydata.producto) {
            find = find + "producto=" + bodydata.producto + "&";
        }
        if (bodydata.fecha_inicio) {
            find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
        }
        if (bodydata.fecha_fin) {
            find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
        }
        if (bodydata.tipo) {
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if (bodydata.formato) {
            find = find + "formato=" + bodydata.formato + "&";;
        }
        if (bodydata.longitud_pagina) {
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";;
        }
        if (bodydata.numero_pagina) {
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }

        return this._http.get<ProductReportResult>(this.url + find, { headers: this.agregarAuthorizationHeader() });

    }

    getReportsListFilterProduct(bodydata: ReportSearch): Observable<ProductReportResult> {
        let find = "reportes?";
        if (bodydata.cliente) {
            find = find + "cliente=" + bodydata.cliente + "&";
        }
        if (bodydata.producto) {
            find = find + "producto=" + bodydata.producto + "&";
        }
        if (bodydata.fecha_inicio) {
            find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
        }
        if (bodydata.fecha_fin) {
            find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
        }
        if (bodydata.tipo) {
            find = find + "tipo=" + bodydata.tipo + "&";
        }
        if (bodydata.formato) {
            find = find + "formato=" + bodydata.formato + "&";
        }
        if (bodydata.longitud_pagina) {
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if (bodydata.numero_pagina) {
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }


        //console.log(this.url+ find);
        return this._http.get<ProductReportResult>(this.url + find, { headers: this.agregarAuthorizationHeader() });
    }

    getExecutions(bodydata: MinimalSearch): Observable<ResultadoPorEjecucion> {
        let find = "programacion-reportes/programaciones?";

        if (bodydata.longitud_pagina) {
            find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
        }
        if (bodydata.numero_pagina) {
            find = find + "numero_pagina=" + bodydata.numero_pagina;
        }

        return this._http.get<ResultadoPorEjecucion>(this.url + find, { headers: this.agregarAuthorizationHeader() });
    }

    getReportById(codigo: number) {
        const find = `programacion-reportes/${codigo}`;
        return this._http.get<Programacion>(this.url + find, { headers: this.agregarAuthorizationHeader() });
    }

    executeReport() {
        const find = "programacion-reportes/ejecutar-reporte-tareas";
        return this._http.post(this.url + find, undefined, { headers: this.agregarAuthorizationHeader() }).pipe(
            map(() => { return true; })
        )
    }

    updateDestinatarios(codigo: number, bodyData: UpdateDestinatariosDTO) {
        const find = `programacion-reportes/${codigo}`;
        let parametros = JSON.stringify(bodyData);
        return this._http.patch(this.url + find, parametros, { headers: this.agregarAuthorizationHeader() });
    }

    /**************************************************************************************************************/

}
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.service";
import { Client } from "../interfaces/client.interface";
import { Product, ProductsSearch } from "../interfaces/product.interface";
import { ProductsResult } from "../interfaces/product.interface";
import { ReportSearch } from "../interfaces/report.interface";
import { ClientReportResult } from "../interfaces/report.interface";
import { ProductReportResult } from "../interfaces/report.interface";
import { DataChartSolutionCenter } from '../interfaces/dashboard.interface';
import { DataChartXClient } from '../interfaces/dashboard.interface';
import { DataChartSearh } from '../interfaces/dashboard.interface';


@Injectable({
    providedIn: 'root'
})
export class DashboardService {
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

    getDashboardImpresionPlanta(): Observable<DataChartSolutionCenter> {

        return this._http.get<DataChartSolutionCenter>(this.url + 'dashboard/chart-impresion-planta', { headers: this.agregarAuthorizationHeader() });
    }


    getDashboardImpresionClient(bodydata: DataChartSearh): Observable<DataChartXClient> {

        let find = "dashboard/chart-impresion-mes-cliente?";

        if (bodydata.m) {
            find = find + "m=" + bodydata.m + "&";
        }
        if (bodydata.a) {
            find = find + "a=" + bodydata.a;
        }

        return this._http.get<DataChartXClient>(this.url + find, { headers: this.agregarAuthorizationHeader() });
    }

}

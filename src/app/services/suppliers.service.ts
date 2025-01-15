import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.service";
import { SupplierSearch, SuppliersResponse, NewSupplier, DeleteSupplier } from '../interfaces/suppliers.interface';

@Injectable({
  providedIn: 'root'
})
export class SuppliersService {
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

  getSuppliers(bodydata: SupplierSearch): Observable<SuppliersResponse> {
    let find = "proveedores?";
    if (bodydata.termino) {
      find = find + "termino=" + bodydata.termino + "&";
    }
    if (bodydata.longitud_pagina) {
      find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
    }
    if (bodydata.numero_pagina) {
      find = find + "numero_pagina=" + bodydata.numero_pagina;
    }
    return this._http.get<SuppliersResponse>(this.url + find, { headers: this.agregarAuthorizationHeader() });
  }

  newSupplier(userData: NewSupplier): Observable<any> {

    let parametros = JSON.stringify(userData);

    return this._http.post<any>(this.url + 'proveedores', parametros, { headers: this.agregarAuthorizationHeader() });
  }

  deleteSupplier(user: string): Observable<any> {

    return this._http.delete<any>(this.url + 'proveedores/' + user, { headers: this.agregarAuthorizationHeader() });
  }

}

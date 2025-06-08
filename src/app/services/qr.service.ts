import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { User } from "../models/user";
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.service";
import { GetSecuencia, GeneratorQR, QrResponse, QrResponseFile, QrRegistrar } from '../interfaces/generador-qr.interface';


import { NewArticle, ArticleUpdateInterface, NewOrder, OrdersSearch, OrderResponse } from '../interfaces/article.interface';

@Injectable({
  providedIn: 'root'
})
export class QrService {
  public url: string;
  private _usuario!: User;
  private httpHeaders = new HttpHeaders().set('content-type', 'application/json');
  private httpHeadersFile = new HttpHeaders();//.set('content-type', 'multipart/form-data');

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

  private agregarAuthorizationHeaderFile() {
    var token = this._securityService.token;
    if (token != null) {
      return this.httpHeadersFile.append('Authorization', 'Bearer ' + token);
    }
    return this.httpHeadersFile;
  }

  getSecuencia(bodydata: GetSecuencia): Observable<number> {
    let find = "generador-qr/secuencia?";
    if (bodydata.tipo) {
      find = find + "tipo=" + bodydata.tipo;
    }

    return this._http.get<number>(this.url + find, { headers: this.agregarAuthorizationHeader() });
  }

  generatorQr(userData: GeneratorQR): Observable<QrResponse> {

    let parametros = JSON.stringify(userData);

    return this._http.post<QrResponse>(this.url + 'generador-qr', parametros, { headers: this.agregarAuthorizationHeader() });
  }

  generatorQrFile(formData: FormData): Observable<QrResponseFile> {

    return this._http.post<QrResponseFile>(this.url + 'generador-qr/excel', formData, { headers: this.agregarAuthorizationHeaderFile() });
  }

  registrarQr(bodydata: QrRegistrar): Observable<any> {

    let parametros = JSON.stringify(bodydata);

    return this._http.post<any>(this.url + 'generador-qr/registrar/' + bodydata.qr,  parametros, { headers: this.agregarAuthorizationHeader() });
  }













  /**********************************************************************************************************************************/
  newArticle(userData: NewArticle): Observable<any> {

    let parametros = JSON.stringify(userData);

    return this._http.post<any>(this.url + 'articulos', parametros, { headers: this.agregarAuthorizationHeader() });
  }

  updateArticle(userData: ArticleUpdateInterface, codigo: string): Observable<any> {
    let parametros = JSON.stringify(userData);;

    return this._http.put<any>(this.url + 'articulos/' + codigo, parametros, { headers: this.agregarAuthorizationHeader() });
  }

  deleteArticle(codigo: string): Observable<any> {

    return this._http.delete<any>(this.url + 'articulos/' + codigo, { headers: this.agregarAuthorizationHeader() });
  }

  newOrder(userData: NewOrder): Observable<any> {

    let parametros = JSON.stringify(userData);

    return this._http.post<any>(this.url + 'articulos/ordenes', parametros, { headers: this.agregarAuthorizationHeader() });
  }

  getOrders(bodydata: OrdersSearch): Observable<OrderResponse> {
    let find = "articulos/ordenes?";
    if (bodydata.longitud_pagina) {
      find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
    }
    if (bodydata.numero_pagina) {
      find = find + "numero_pagina=" + bodydata.numero_pagina + "&";
    }
    if (bodydata.fecha_inicio) {
      find = find + "fecha_inicio=" + bodydata.fecha_inicio + "&";
    }
    if (bodydata.fecha_fin) {
      find = find + "fecha_fin=" + bodydata.fecha_fin + "&";
    }
    if (bodydata.nombre_proveedor) {
      find = find + "nombre_proveedor=" + bodydata.nombre_proveedor + "&";
    }
    if (bodydata.codigo_articulo) {
      find = find + "codigo_articulo=" + bodydata.codigo_articulo + "&";
    }
    if (bodydata.tipo_movimiento) {
      find = find + "tipo_movimiento=" + bodydata.tipo_movimiento + "&";
    }
    if (bodydata.nombre_usuario) {
      find = find + "nombre_usuario=" + bodydata.nombre_usuario + "&";
    }
    if (bodydata.numero_orden) {
      find = find + "numero_orden=" + bodydata.numero_orden; + "&";
    }
    if (bodydata.numero_remito) {
      find = find + "numero_remito=" + bodydata.numero_remito;
    }
    return this._http.get<OrderResponse>(this.url + find, { headers: this.agregarAuthorizationHeader() });
  }

}

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { Global } from "./global";
import { Router } from '@angular/router';
import { SecurityService } from "./security.service";
import { User } from "../models/user";
import { TaskSearch } from '../interfaces/task-search.interface';
import { ReportSearch } from '../interfaces/report.interface';

@Injectable({
  providedIn: 'root'
})
export class FileManagerService {
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

  downloadFileTasksListFilter(bodydata: TaskSearch): Observable<any> {
    let find = "tareas?";
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
    if (bodydata.longitud_pagina) {
      find = find + "longitud_pagina=" + bodydata.longitud_pagina + "&";
    }
    if (bodydata.numero_pagina) {
      find = find + "numero_pagina=" + bodydata.numero_pagina + "&";
    }
    if (bodydata.formato) {
      find = find + "formato=" + bodydata.formato;
    }

    return this._http.get<any>(this.url + find, {
      headers: this.agregarAuthorizationHeader(),
      //responseType: 'blod' as 'json'
      responseType: 'arraybuffer' as 'json'
    });

  }

  downloadReportsListFilterClient(bodydata: ReportSearch): Observable<any> {
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


    return this._http.get<any>(this.url + find, { 
      headers: this.agregarAuthorizationHeader(),
      responseType: 'arraybuffer' as 'json'
    });
  }


  downloadReportsListFilterProduct(bodydata: ReportSearch): Observable<any> {
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


    return this._http.get<any>(this.url + find, { 
      headers: this.agregarAuthorizationHeader(),
      responseType: 'arraybuffer' as 'json'
    });
  }


}

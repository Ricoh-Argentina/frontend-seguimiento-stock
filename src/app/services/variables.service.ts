import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { SecurityService } from './security.service';
import { Global } from './global';
import { Rol, ModoImpresion, TamPapel, UnidadArticulo, TipoMovimiento, TipoArticulo } from '../interfaces/variables.interface';

@Injectable({
  providedIn: 'root'
})
export class VariablesService {

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

  getRoles(): Observable<Rol[]> {

    return this._http.get<Rol[]>(this.url + 'variables/roles', { headers: this.agregarAuthorizationHeader() });

  }

  getModoImpresion(): Observable<ModoImpresion[]> {

    return this._http.get<ModoImpresion[]>(this.url + 'variables/modo-impresion', { headers: this.agregarAuthorizationHeader() });

  }

  getTamPapel(): Observable<TamPapel[]> {

    return this._http.get<TamPapel[]>(this.url + 'variables/tam-papel', { headers: this.agregarAuthorizationHeader() });

  }

  getUnidadArticulos(): Observable<UnidadArticulo[]> {

    return this._http.get<UnidadArticulo[]>(this.url + 'variables/unidad-articulos', { headers: this.agregarAuthorizationHeader() });

  }

  getTipoMovimiento(): Observable<TipoMovimiento[]> {

    return this._http.get<TipoMovimiento[]>(this.url + 'variables/tipo-movimiento', { headers: this.agregarAuthorizationHeader() });

  }

  getTipoArticulo(): Observable<TipoArticulo[]> {

    return this._http.get<TipoArticulo[]>(this.url + 'variables/tipo-articulo', { headers: this.agregarAuthorizationHeader() });

  }
}

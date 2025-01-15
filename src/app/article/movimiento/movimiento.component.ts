import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { ArticlesService } from '../../services/articles.service';
import { SecurityService } from '../../services/security.service';
import { VariablesService } from '../../services/variables.service';
import { SuppliersService } from '../../services/suppliers.service';
import { Router } from '@angular/router';
import { UserInterface } from '../../interfaces/user.interface';
import { Rol } from '../../interfaces/variables.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { Global } from '../../services/global';
import { provideNativeDateAdapter } from '@angular/material/core';

/*Angular Material */
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Imagen } from '../../interfaces/client.interface';
import { ArticleSearch, Articulo, NewOrder } from '../../interfaces/article.interface';
//import { Proveedores } from '../../interfaces/suppliers.interface';
import { Proveedores } from '../../interfaces/article.interface';
import { state } from '@angular/animations';

const MATERIAL_MODULES = [MatDatepickerModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule];


@Component({
  selector: 'app-movimiento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './movimiento.component.html',
  styleUrl: './movimiento.component.scss',
  providers: [UserService, SecurityService, provideNativeDateAdapter()]
})
export class MovimientoComponent implements OnInit {

  //Variables para seleccionar listas
  public selectedCodigo: string = "";
  public selectedProveedor: string = "";
  public selectedMovimiento: string = "";

  //String que levantan las listas de los menu desplegables
  public codigos: Articulo[] = [];
  public proveedores: Proveedores[] = [];
  public movimientos: string[] = [];

  public articuloSeleccionado: Articulo[] = [];
  public isLoadingResults: boolean = true;

  public DateSelected = new FormControl(new Date());/* Creo fecha actual */

  formNewOrder = this._formBuilder.group({
    codigo_articulo: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30)
    ]],
    nombre_proveedor: [{ value: "", disabled: true }, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(40)
    ]],
    numero_remito: [{ value: "", disabled: true }, [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(40)
    ]],
    tipo_movimiento: [{ value: "", disabled: true }, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]],
    cantidad: [{ value: 0, disabled: true }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
      Validators.min(1)
    ]],
    descripcion: [{ value: "", disabled: true }, [
      Validators.minLength(1),
      Validators.maxLength(100)
    ]],
    cantidadStock: [{ value: 0, disabled: true }, [
      Validators.minLength(1),
      Validators.maxLength(20)
    ]]
  });



  constructor(
    private _articlesService: ArticlesService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _variablesService: VariablesService,
    private _suppliersService: SuppliersService
  ) {
    this.movimientos = Global.movimientos;
  }


  get codigo_articulo() {
    return this.formNewOrder.controls['codigo_articulo'];
  }

  get nombre_proveedor() {
    return this.formNewOrder.controls['nombre_proveedor'];
  }

  get tipo_movimiento() {
    return this.formNewOrder.controls['tipo_movimiento'];
  }

  get cantidad() {
    return this.formNewOrder.controls['cantidad'];
  }

  get numero_remito() {
    return this.formNewOrder.controls['numero_remito'];
  }

  ngOnInit(): void {
    this.loadCodigoArticulos();
  }

  loadCodigoArticulos() {

    let bodydata: ArticleSearch = {
      termino: "",
      longitud_pagina: 10000,
      numero_pagina: 1,
    };

    this._articlesService.getArticles(bodydata)
      .pipe(
        tap(data => {
          this.codigos = data.articulos;

        }),
        catchError(err => {
          console.log("Error cargando los Articulos ", err);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  cancelOrder() {
    this.formNewOrder.controls.codigo_articulo.setValue("");
    this.formNewOrder.controls.nombre_proveedor.setValue("");
    this.formNewOrder.controls.descripcion.setValue("");
    this.formNewOrder.controls.cantidadStock.setValue(0);
    this.formNewOrder.controls.cantidad.setValue(0);
    this.formNewOrder.controls.numero_remito.setValue("");
    this.formNewOrder.controls.tipo_movimiento.setValue("");
    this.formNewOrder.controls.nombre_proveedor.disable();
    this.formNewOrder.controls.descripcion.disable();
    this.formNewOrder.controls.cantidadStock.disable();
    this.formNewOrder.controls.cantidad.disable()
    this.formNewOrder.controls.numero_remito.disable();
    this.formNewOrder.controls.tipo_movimiento.disable();
    
  }

  createNewOrder() {

    let aDate = this.DateSelected.value !== null ? this.DateSelected.value.toISOString() : "";

    let bodydata: NewOrder = {
      fecha_movimiento: aDate,
      codigo_articulo: this.codigo_articulo.value !== null ? this.codigo_articulo.value : '',
      nombre_proveedor: this.nombre_proveedor.value !== null ? this.nombre_proveedor.value : '',
      tipo_movimiento: this.tipo_movimiento.value !== null ? this.tipo_movimiento.value : '',
      cantidad: this.cantidad.value !== null ? this.cantidad.value : 0,
      numero_remito: this.numero_remito.value !== null ? this.numero_remito.value : '',
    };

    this._articlesService.newOrder(bodydata).subscribe(
      {
        next: (resultado) => {
          //Guardo en el sessionStorage el usuario y el token
          alert("Orden creado con exito a las " + new Date());
          this.formNewOrder.reset();
          this.formNewOrder.controls.cantidad.setValue(0);
        },
        error: (error) => {
          if (error.status == 400) {
            alert(error.error.message);
          }

          if (error.status == 403 || error.status == 401 || error.status == 500) {

            alert("ERROR al crear la Orden!!!");
          }
        },
        complete: () => console.info('Peticion Completada')
      }
    );
  }

  /* Al selecccionar el articulo levando el dato y cargo los proveedores asociados a este producto */
  /* además de levantar descripcion y cantidad restante */
  changeCodeArticle() {

    let bodydata: ArticleSearch = {
      termino: this.selectedCodigo,
      longitud_pagina: 1000,
      numero_pagina: 1,
    };

    this._articlesService.getArticles(bodydata)
      .pipe(
        tap(data => {
          this.articuloSeleccionado = data.articulos;
          this.formNewOrder.controls.nombre_proveedor.setValue("");
          this.proveedores = data.articulos[0].proveedores;
          this.formNewOrder.controls.descripcion.setValue(data.articulos[0].descripcion);
          this.formNewOrder.controls.cantidadStock.setValue(data.articulos[0].cantidad);
          this.formNewOrder.controls.nombre_proveedor.enable();
        }),
        catchError(err => {
          console.log("Error cargando los datos de Articulos ", err);
          alert("Error cargando los datos de Articulos ");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();

  }

  changeProveedor() {
    this.formNewOrder.controls.tipo_movimiento.enable();
  }

  changeMovimiento() {

    if (this.selectedMovimiento == "ingreso") {
      this.formNewOrder.controls.cantidad.enable();
      this.formNewOrder.controls.numero_remito.enable();
    } else {
      this.formNewOrder.controls.cantidad.enable();
      this.formNewOrder.controls.numero_remito.disable();
    }

  }

  verifyDate() {

  }

}



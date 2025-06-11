import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../services/user.service';
import { QrService } from '../services/qr.service';
import { SecurityService } from '../services/security.service';
import { Router } from '@angular/router';
import { Rol } from '../interfaces/variables.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Global } from '../services/global';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

/*Angular Material */
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { Imagen } from '../interfaces/client.interface';
import { GetSecuencia, GeneratorQR, QrResponse,QrResponseFile } from '../interfaces/generador-qr.interface';
import { Articulo } from '../interfaces/article.interface';
import { state } from '@angular/animations';
import { ArticlesService } from '../services/articles.service';
import { ArticleSearch, Proveedores } from '../interfaces/article.interface';
import { SupplierSearch } from '../interfaces/suppliers.interface';
import { SuppliersService } from '../services/suppliers.service';

import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import 'moment/locale/es';
import { catchError, finalize, tap, throwError } from 'rxjs';

import generatePDF from '../library/pdf';
import { HttpErrorResponse, HttpResponse } from '@angular/common/http';


const MATERIAL_MODULES = [MatDatepickerModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule];


@Component({
  selector: 'app-generador-qr',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './generador-qr.component.html',
  styleUrl: './generador-qr.component.scss',
  providers: [UserService, SecurityService, provideNativeDateAdapter(), { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }, provideMomentDateAdapter()]
})
export class GeneradorQrComponent implements OnInit {

  public selectedFiles: FileList | null = null;
  public selectedFilesView: string = "";

  //Variables para seleccionar listas
  public selectedCodigo: string = "";
  public selectedProveedor: string = "";

  //String que levantan las listas de los menu desplegables
  public codigos: Articulo[] = [];
  public proveedores: Proveedores[] = [];
  //public tipos: string[] = [];
  public articuloSeleccionado: Articulo[] = [];

  public isLoadingResults: boolean = true;

  public DateSelected = new FormControl(new Date());/* Creo fecha actual */

  formQRGenerator = this._formBuilder.group({
    codigo_articulo: ['', [
      Validators.minLength(4),
      Validators.maxLength(30)
    ]],
    nombre_proveedor: [{ value: "", disabled: true }, [
      Validators.minLength(4),
      Validators.maxLength(40)
    ]],
    numero_secuencia: [{ value: 0, disabled: true }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
      Validators.min(1)
    ]],
    cantidad: [{ value: 1, disabled: true }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
      Validators.min(1)
    ]],
    peso: [{ value: 0, disabled: true }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20),
      Validators.min(100)
    ]],
    descripcion: [{ value: "", disabled: true }, [
      Validators.minLength(1),
      Validators.maxLength(100)
    ]],
    selectedFilesView: [{ value: "", disabled: true }, [
      Validators.minLength(1),
      Validators.maxLength(100)
    ]]
  });



  constructor(
    private _qrService: QrService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _articlesService: ArticlesService,
    private _suppliersService: SuppliersService,
  ) {
    this.loadCodigoArticulos();
  }

  get codigo_articulo() {
    return this.formQRGenerator.controls['codigo_articulo'];
  }

  get nombre_proveedor() {
    return this.formQRGenerator.controls['nombre_proveedor'];
  }

  get numero_secuencia() {
    return this.formQRGenerator.controls['numero_secuencia'];
  }

  get cantidad() {
    return this.formQRGenerator.controls['cantidad'];
  }

  get peso() {
    return this.formQRGenerator.controls['peso'];
  }

  get descripcion() {
    return this.formQRGenerator.controls['descripcion'];
  }

  ngOnInit(): void {
    this.DateSelected.disable();
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
          alert(err.error.message);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
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
          this.proveedores = data.articulos[0].proveedores;
          this.formQRGenerator.controls.nombre_proveedor.enable();
        }),
        catchError(err => {
          alert(err.error.message);
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();

  }

  changeProveedor() {
    //console.log(this.selectedProveedor);
    
    /*******************************************/
    /* Revisar este codigo cuando se modifique permitir otras secuencias */
    let bodydata: GetSecuencia = {
      tipo: this.articuloSeleccionado[0].tipo_articulo,
    };
    /*******************************************/

    this._qrService.getSecuencia(bodydata)
      .pipe(
        tap(data => {
          this.formQRGenerator.controls.numero_secuencia.setValue(data);
          this.formQRGenerator.controls.peso.enable();
          this.formQRGenerator.controls.descripcion.enable();
        }),
        catchError(err => {
          alert(err.error.message);
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  cancelarLimpiarEtiqueta() {
    this.formQRGenerator.controls.codigo_articulo.setValue("");
    this.formQRGenerator.controls.nombre_proveedor.setValue("");
    this.formQRGenerator.controls.numero_secuencia.setValue(0);
    this.formQRGenerator.controls.descripcion.setValue("");
    this.formQRGenerator.controls.selectedFilesView.setValue("");
    this.formQRGenerator.controls.cantidad.setValue(1);
    this.formQRGenerator.controls.peso.setValue(0);
    this.formQRGenerator.controls.numero_secuencia.disable();
    this.formQRGenerator.controls.cantidad.disable();
    this.formQRGenerator.controls.nombre_proveedor.disable();
  }

  imprimirEtiqueta() {

    let aDate = this.DateSelected.value !== null ? this.DateSelected.value.toISOString() : "";

    let bodydata: GeneratorQR = {
      fecha: aDate,
      codigo_articulo: this.codigo_articulo.value !== null ? this.codigo_articulo.value : '',
      nombre_proveedor: this.nombre_proveedor.value !== null ? this.nombre_proveedor.value : '',
      numero_secuencia: this.numero_secuencia.value !== null ? this.numero_secuencia.value : 0,
      peso: this.peso.value !== null ? this.peso.value : 0,
      cantidad: this.cantidad.value !== null ? this.cantidad.value : 0,
      descripcion: this.descripcion.value !== null ? this.descripcion.value : '',
    };

    this._qrService.generatorQr(bodydata)
      .pipe(
        tap(data => {
          generatePDF([data]);
        }),
        catchError(err => {
          alert(err.error.message);
          return throwError(err);
        }),
        finalize(() => {
          this.isLoadingResults = false;
          this.cancelarLimpiarEtiqueta();
        })
      )
      .subscribe();



  }

  changeTipo() {
  }

  getFile(event: Event) {

    const target = event.target as HTMLInputElement;

    this.selectedFiles = target.files;

    if (this.selectedFiles!.length > 0 && this.selectedFiles != null) {
      const formData = new FormData();

      Array.prototype.forEach.call(this.selectedFiles, (file: File) => {
        formData.append("excel", file);
        this.selectedFilesView = this.selectedFilesView + `${file.name}`;
      });

      this.formQRGenerator.controls.selectedFilesView.setValue(this.selectedFilesView);

      
      this._qrService.generatorQrFile(formData).subscribe({
        next: (result: QrResponseFile) => {
          generatePDF(result.result);
        },
        error: (err: HttpErrorResponse) => {
          alert(err.error.message);
        },
        complete: () => {
          console.log("Peticion completada");
          this.cancelarLimpiarEtiqueta();
        }
      });
    }

  }

}

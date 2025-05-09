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
import { GetSecuencia, GeneratorQR } from '../interfaces/generador-qr.interface';
import { state } from '@angular/animations';

import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import 'moment/locale/es';
import { catchError, finalize, tap, throwError } from 'rxjs';



const MATERIAL_MODULES = [MatDatepickerModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule];


@Component({
  selector: 'app-generador-qr',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './generador-qr.component.html',
  styleUrl: './generador-qr.component.scss',
  providers: [UserService, SecurityService, provideNativeDateAdapter(), {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, provideMomentDateAdapter()]
})
export class GeneradorQrComponent implements OnInit {

  //Variables para seleccionar listas
  public selectedArticulo: string = "";

  //String que levantan las listas de los menu desplegables
  public articulos: string[] = [];
  
  public isLoadingResults: boolean = true;

  public DateSelected = new FormControl(new Date());/* Creo fecha actual */

  formQRGenerator = this._formBuilder.group({
    articulo: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(30)
    ]],
    numeroSecuencia: [{ value: 0, disabled: true }, [
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
    ]]
  });



  constructor(
    private _qrService: QrService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.articulos = Global.articulos;
  }

  get articulo() {
    return this.formQRGenerator.controls['articulo'];
  }

  get numeroSecuencia() {
    return this.formQRGenerator.controls['numeroSecuencia'];
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

  cancelEtiqueta() {
    this.formQRGenerator.controls.articulo.setValue("");
    this.formQRGenerator.controls.numeroSecuencia.setValue(0);
    this.formQRGenerator.controls.descripcion.setValue("");
    this.formQRGenerator.controls.cantidad.setValue(1);
    this.formQRGenerator.controls.peso.setValue(0);
    this.formQRGenerator.controls.numeroSecuencia.disable();
    this.formQRGenerator.controls.cantidad.disable()
    
  }

  imprimirEtiqueta() {

    let aDate = this.DateSelected.value !== null ? this.DateSelected.value.toISOString() : "";

    let bodydata: GeneratorQR = {
      fecha_creacion: aDate,
      articulo: this.articulo.value !== null ? this.articulo.value : '',
      numeroSecuencia: this.numeroSecuencia.value !== null ? this.numeroSecuencia.value : 0,
      peso: this.peso.value !== null ? this.peso.value : 0,
      cantidad: this.cantidad.value !== null ? this.cantidad.value : 0,
      descripcion: this.descripcion.value !== null ? this.descripcion.value : '',
    };

    console.log(bodydata);

  }

  changeArticle() {

    let bodydata: GetSecuencia = {
      tipo: this.selectedArticulo.toLowerCase(),
    };

    
    this._qrService.getSecuencia(bodydata)
      .pipe(
        tap(data => {
          this.formQRGenerator.controls.numeroSecuencia.setValue(data);
          this.formQRGenerator.controls.peso.enable();
          this.formQRGenerator.controls.descripcion.enable();
        }),
        catchError(err => {
          console.log("Error solicitando la secuencia del producto", err);
          alert("Error solicitando la secuencia del producto ");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
   
  }

}

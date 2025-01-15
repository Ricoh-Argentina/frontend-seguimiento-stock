import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SuppliersService } from '../../../services/suppliers.service';
import { SecurityService } from '../../../services/security.service';
import { VariablesService } from '../../../services/variables.service';
import { Router } from '@angular/router';
import { NewSupplier } from '../../../interfaces/suppliers.interface';
import { UserInterface } from '../../../interfaces/user.interface';
import { Rol } from '../../../interfaces/variables.interface';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { Global } from '../../../services/global';

/*Angular Material */
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { Imagen } from '../../../interfaces/client.interface';

const MATERIAL_MODULES = [MatInputModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatButtonModule];


@Component({
  selector: 'app-newSuppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './newSuppliers.component.html',
  styleUrl: './newSuppliers.component.scss'
})
export class NewSuppliersComponent implements OnInit {

  //Variables para seleccionar listas
  public selectedRol: string = "";
  public selectedImagen: string = "";

  //String que levantan las listas de los menu desplegables
  public roles: Rol[] = [];
  public avatares: string[] = [];

  public isLoadingResults: boolean = true;

  formNewSupplier = this._formBuilder.group({
    nombre_proveedor: ['', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]]
  });



  constructor(
    private _suppliersService: SuppliersService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _variablesService: VariablesService
  ) {
    this.avatares = Global.avatares;
  }

  get nombre_proveedor() {
    return this.formNewSupplier.controls['nombre_proveedor'];
  }
  
  ngOnInit(): void {
    
  }

  createNewSupplier() {

    let bodydata: NewSupplier = {
      nombre_proveedor: this.nombre_proveedor.value !== null ? this.nombre_proveedor.value : '',
    };

    this._suppliersService.newSupplier(bodydata).subscribe(
      {
        next: (resultado) => {
          //Guardo en el sessionStorage el usuario y el token
          /*if (resultado.estado) {*/
            alert("Proveedor creado con exito a las " + new Date());
            this.formNewSupplier.reset();
          /*} else {
            alert("ERROR no se ha podido generar el proveedor");
          }*/

        },
        error: (error) => {
          if (error.status == 403 || error.status == 401 || error.status == 500) {

            alert("ERROR al crear el proveedor!!!");
          }
        },
        complete: () => {}
      }
    );
  }
}

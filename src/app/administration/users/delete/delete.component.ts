import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { SecurityService } from '../../../services/security.service';
import { UserService } from '../../../services/user.service';
import { ReportsService } from '../../../services/reports.service';
import { VariablesService } from '../../../services/variables.service';
import { User } from '../../../models/user';
import { Router } from '@angular/router';
import { Global } from '../../../services/global';
import { RouterModule } from '@angular/router';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { TaskSearch } from '../../../interfaces/task-search.interface';
import { Tarea } from '../../../interfaces/tareas.interface';
import { Client } from '../../../interfaces/client.interface';
import { ClientResult } from '../../../interfaces/client.interface';
import { Product } from '../../../interfaces/product.interface';
import { ProductsResult } from '../../../interfaces/product.interface';
import { ProductsSearch } from '../../../interfaces/product.interface';
import { UserInterface } from '../../../interfaces/user.interface';
import { Rol } from '../../../interfaces/variables.interface';
import { UserResponse, Usuario, UserSearch, UserUpdateResponse, UserUpdateInterface } from '../../../interfaces/user.interface';


/*Angular Material */
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox'

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { catchError, finalize, tap, throwError } from 'rxjs';
import { TaskListService } from '../../../services/task-list.service';


const MATERIAL_MODULES = [MatCheckboxModule, MatSlideToggleModule, MatButtonModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule];

@Component({
  selector: 'app-delete',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES],
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
  providers: [UserService, TaskListService, SecurityService, ReportsService, provideNativeDateAdapter()]
})
export class DeleteComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['nombre_y_apellido', 'usuario'];
  public url: string;
  public data: Usuario[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 17;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;
  public isChecked: boolean = true;

  //Variables para seleccionar listas
  public selectedRol: string = "";
  public selectedImagen: string = "";
  public selectedTermino: string = "";
  
  //String que levantan las listas de los menu desplegables
  public roles: Rol[] = [];
  public avatares: string[] = [];

  //Fechas
  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());

  datoSeleccionado: boolean = false;

  //Form
  public isCheckedPassword: boolean = false;
  public isformEditUserActive: boolean = true;
  public isAvailable: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  formFilter = this._formBuilder.group({
    termino: ['', [
      Validators.minLength(1),
      Validators.maxLength(40)
    ]]
  });

  formEditUser = this._formBuilder.group({
    usuario: [{ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(30)
    ]],
    changePassword: { value: '', disabled: true },
    password: [{ value: '', disabled: true }, [
      Validators.minLength(5),
      Validators.maxLength(20)
    ]],
    nombre_y_apellido: [{ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100)
    ]],
    rol: [{ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ]],
    imagen: [{ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]],
    email: [{ value: '', disabled: true }, [
      Validators.required,
      Validators.email,
      Validators.minLength(5),
      Validators.maxLength(40)
    ]]
  });

  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _taskListService: TaskListService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _variablesService: VariablesService
  ) {
    this.url = Global.url;
    this.avatares = Global.avatares;
  }


  get termino() {
    return this.formFilter.controls['termino'];
  }

  ngOnInit(): void {
    this.loadRoles();
  }

  loadRoles() {
    this._variablesService.getRoles()
      .pipe(
        tap(data => {
          this.roles = data;

          this.selectedRol = 'Todos';
        }),
        catchError(err => {
          console.log("Error cargando los Roles ", err);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let bodydata: UserSearch = {
            termino: "",
            longitud_pagina: this.paginator?.pageSize,
            numero_pagina: this.paginator?.pageIndex + 1,
          };

          return this._userService.getUsers(bodydata)
            .pipe(
              catchError(() => observableOf(null))
            );
        }),
        map(data => {
          this.pageNumber = data?.numero_pagina ?? 1;
          this.totalRecords = data?.total_registros ?? 0;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data?.cantidad_paginas ?? 0;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
          this.isRateLimitReached = data === null;

          if (data === null) {
            return [];
          }

          // Only refresh the result length if there is new data. In case of rate
          // limit errors, we do not want to reset the paginator to zero, as that
          // would prevent users from re-triggering requests.
          this.resultsLength = 10;
          return data.usuarios;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  findUser() {

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingResults = true;

    let bodydata: UserSearch = {
      termino: this.termino.value !== null ? this.termino.value : "",
      longitud_pagina: this.paginator?.pageSize,
      numero_pagina: this.paginator?.pageIndex + 1,
    };

    this._userService.getUsers(bodydata)
      .pipe(
        tap(data => {
          this.data = data.usuarios;

          this.pageNumber = data?.numero_pagina ?? 1;
          this.totalRecords = data?.total_registros ?? 0;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data?.cantidad_paginas ?? 0;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
        }),
        catchError(err => {
          console.log("Error cargando los datos de Tareas ", err);
          alert("Error cargando los datos de Tareas ");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  get usuario() {
    return this.formEditUser.controls['usuario'];
  }

  get changePassword() {
    return this.formEditUser.controls['changePassword'];
  }

  get password() {
    return this.formEditUser.controls['password'];
  }

  get nombre_y_apellido() {
    return this.formEditUser.controls['nombre_y_apellido'];
  }
  get rol() {
    return this.formEditUser.controls['rol'];
  }

  get imagen() {
    return this.formEditUser.controls['imagen'];
  }

  get email() {
    return this.formEditUser.controls['email'];
  }

  isChangePassword() {

    if (this.changePassword.value) {
      this.formEditUser.controls.password.enable();
    } else {
      this.formEditUser.controls.password.disable();
    }

    //Indico que active el checked de password para luego poder cancelarlo
    this.isCheckedPassword=true;
  }

  deleteUser() {



    this._userService.deleteUser(this.usuario.value !== null ? this.usuario.value : "").subscribe(
      {
        next: (resultado) => {
          //Guardo en el sessionStorage el usuario y el token
          this.formEditUser.reset();
        },
        error: (error) => {
          console.log(error);
          if (error.status == 403 || error.status == 404) {

            alert("ERROR al Eliminar el usuario!!!");
          }
        },
        complete: () => alert("Usuario borrado con exito")
      }
    );
  }

  clickedRow(row: Usuario) {
    this.formEditUser.controls.nombre_y_apellido.setValue(row.nombre_y_apellido);
    this.formEditUser.controls.usuario.setValue(row.usuario);
    this.formEditUser.controls.email.setValue(row.email);
    this.formEditUser.controls.imagen.setValue(row.imagen);
    this.selectedImagen = row.imagen;
    this.formEditUser.controls.rol.setValue(row.rol);
    this.isformEditUserActive=false;
  }

  CancelForm(){
    this.formEditUser.controls.nombre_y_apellido.setValue("");
    this.formEditUser.controls.usuario.setValue("");
    this.formEditUser.controls.email.setValue("");
    this.formEditUser.controls.imagen.setValue("none.png");
    this.selectedImagen = "none.png";
    this.formEditUser.controls.rol.setValue("");
    this.isformEditUserActive=true;
    this.isCheckedPassword=false;
    this.formEditUser.controls.changePassword.disable();
    this.formEditUser.controls.password.disable();
  }
}


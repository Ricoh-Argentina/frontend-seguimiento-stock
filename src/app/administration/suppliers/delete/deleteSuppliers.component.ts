import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';

import { SecurityService } from '../../../services/security.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { ReportsService } from '../../../services/reports.service';
import { VariablesService } from '../../../services/variables.service';
import { Router } from '@angular/router';
import { Global } from '../../../services/global';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { Proveedores, SupplierSearch } from '../../../interfaces/suppliers.interface';
import { Rol } from '../../../interfaces/variables.interface';
import { Usuario, UserSearch } from '../../../interfaces/user.interface';


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
import { ActivePipePipe } from "../../../pipes/active-pipe.pipe";

const MATERIAL_MODULES = [MatCheckboxModule, MatSlideToggleModule, MatButtonModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule];

@Component({
  selector: 'app-deleteSuppliers',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES, ActivePipePipe],
  templateUrl: './deleteSuppliers.component.html',
  styleUrl: './deleteSuppliers.component.scss',
  providers: [SuppliersService, SecurityService, ReportsService, provideNativeDateAdapter()]
})
export class DeleteSuppliersComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['nombre_proveedor', 'estado'];
  public url: string;
  public data: Proveedores[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 17;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;
  public isChecked: boolean = true;

  //Variables para seleccionar listas
  public selectedTermino: string = "";
  
  //Fechas
  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());

  datoSeleccionado: boolean = false;

  //Form
  public isformEditSupplierActive: boolean = true;
  public isAvailable: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  formFilter = this._formBuilder.group({
    termino: ['', [
      Validators.minLength(1),
      Validators.maxLength(40)
    ]]
  });

  formEditProveedor = this._formBuilder.group({
    nombre_proveedor: [{ value: '', disabled: true }, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ]],
    estado: [{ value: false, disabled: true }, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(20)
    ]]
  });

  constructor(
    private _suppliersService: SuppliersService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _variablesService: VariablesService
  ) {
    this.url = Global.url;
  }


  get termino() {
    return this.formFilter.controls['termino'];
  }

  ngOnInit(): void {
    
  }

  ngAfterViewInit() {
    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {
          this.isLoadingResults = true;
          let bodydata: SupplierSearch = {
            termino: "",
            longitud_pagina: this.paginator?.pageSize,
            numero_pagina: this.paginator?.pageIndex + 1,
          };

          return this._suppliersService.getSuppliers(bodydata)
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
          return data.proveedores;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  findSupplier() {

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingResults = true;

    let bodydata: SupplierSearch = {
      termino: this.termino.value !== null ? this.termino.value : "",
      longitud_pagina: this.paginator?.pageSize,
      numero_pagina: this.paginator?.pageIndex + 1,
    };

    this._suppliersService.getSuppliers(bodydata)
      .pipe(
        tap(data => {
          this.data = data.proveedores;

          this.pageNumber = data?.numero_pagina ?? 1;
          this.totalRecords = data?.total_registros ?? 0;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data?.cantidad_paginas ?? 0;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
        }),
        catchError(err => {
          alert(err.error.message);
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  get nombre_proveedor() {
    return this.formEditProveedor.controls['nombre_proveedor'];
  }
  
  deleteSupplier() {



    this._suppliersService.deleteSupplier(this.nombre_proveedor.value !== null ? this.nombre_proveedor.value : "").subscribe(
      {
        next: (resultado) => {
          //Guardo en el sessionStorage el usuario y el token
          this.formEditProveedor.reset();
          this.isformEditSupplierActive=true;
        },
        error: (error) => {
          alert(error.error.message);
          if (error.status == 403 || error.status == 404) {

            alert(error.error.message);
          }
        },
        complete: () => alert("Proveedor borrado con exito")
      }
    );
  }

  clickedRow(row: Proveedores) {
    this.formEditProveedor.controls.nombre_proveedor.setValue(row.nombre_proveedor);
    this.formEditProveedor.controls.estado.setValue(row.estado);
    this.isformEditSupplierActive=false;
  }

  CancelForm(){
    this.formEditProveedor.controls.nombre_proveedor.setValue("");
    this.formEditProveedor.controls.estado.setValue(false);
    this.isformEditSupplierActive=true;
    //this.isCheckedPassword=false;
  }
}


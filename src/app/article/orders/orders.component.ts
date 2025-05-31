import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { SecurityService } from '../../services/security.service';
import { UserService } from '../../services/user.service';
import { TaskListService } from '../../services/task-list.service';
import { FileManagerService } from '../../services/file-manager.service';
import { SuppliersService } from '../../services/suppliers.service';
import { User } from '../../models/user';
import { Router } from '@angular/router';
import { Global } from '../../services/global';
import { RouterModule } from '@angular/router';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { Ordenes } from '../../interfaces/article.interface';
import { Proveedores } from '../../interfaces/suppliers.interface';

/*Angular Material */
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule, SortDirection } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button'
import { DateAdapter, MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { catchError, finalize, tap, throwError } from 'rxjs';
import { ArticleSearch, Articulo, OrdersSearch } from '../../interfaces/article.interface';
import { ArticlesService } from '../../services/articles.service';
import { SupplierSearch } from '../../interfaces/suppliers.interface';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import 'moment/locale/es';

const MATERIAL_MODULES = [
  MatDatepickerModule,
  MatSelectModule,
  MatTableModule,
  MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSortModule,
  MatPaginatorModule,
  MatProgressSpinnerModule,
  MatButtonModule
];

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss',
  providers: [UserService, SecurityService, TaskListService, FileManagerService,  {provide: MAT_DATE_LOCALE, useValue: 'es-ES'}, provideMomentDateAdapter() ]
})
export class OrdersComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['codigo_articulo', 'nombre_proveedor', 'tipo_movimiento', 'cantidad', 'fecha_movimiento', 'numero_remito', 'nombre_usuario', 'numero_orden'];
  public url: string;
  public data: Ordenes[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 20;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;
  public isDownloadFileDisabled: boolean = true;

  //Variables para seleccionar listas
  public selectedCodigo: string = "";
  public selectedProveedor: string = "";
  public selectedMovimiento: string = "";

  //String que levantan las listas de los menu desplegables
  public codigos: Articulo[] = [];
  public proveedores: Proveedores[] = [];
  public movimientos: string[] = [];

  public articuloSeleccionado: Articulo[] = [];

  //Fechas
  startDate = new FormControl(new Date(2022, 0, 1));/* Creo con fecha inicial 01/01/2022 */
  endDate = new FormControl(new Date());/* Creo con fecha final la actual */

  public selectedTermino: string = "";

  datoSeleccionado: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  formFilter = this._formBuilder.group({
    codigo_articulo: ['', [
      Validators.minLength(4),
      Validators.maxLength(30)
    ]],
    nombre_proveedor: [{ value: "", disabled: false }, [
      Validators.minLength(4),
      Validators.maxLength(40)
    ]],
    numero_remito: [{ value: "", disabled: false }, [
      Validators.minLength(3),
      Validators.maxLength(40)
    ]],
    tipo_movimiento: [{ value: "", disabled: false }, [
      Validators.minLength(4),
      Validators.maxLength(20)
    ]]
  });

  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _suppliersService: SuppliersService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _fileManagerService: FileManagerService,
    private _articlesService: ArticlesService,
  ) {
    this.url = Global.url;
    this.movimientos = Global.movimientos;
  }

  get codigo_articulo() {
    return this.formFilter.controls['codigo_articulo'];
  }

  get nombre_proveedor() {
    return this.formFilter.controls['nombre_proveedor'];
  }

  get tipo_movimiento() {
    return this.formFilter.controls['tipo_movimiento'];
  }

  get numero_remito() {
    return this.formFilter.controls['numero_remito'];
  }

  ngOnInit(): void {
    this.loadCodigoArticulos();
    this.loadSuppliers();
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

  loadSuppliers() {

    let bodydata: SupplierSearch = {
      termino: "",
      longitud_pagina: 10000,
      numero_pagina: 1,
    };

    this._suppliersService.getSuppliers(bodydata)
      .pipe(
        tap(data => {
          this.proveedores = data.proveedores;

        }),
        catchError(err => {
          console.log("Error cargando los Proveedores ", err);
          this._securityService.logout();
          this._router.navigateByUrl("/");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  /*********************************TABLA*********************************************/

  ngAfterViewInit() {

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    // If the user changes the sort order, reset back to the first page.
    this.sort.sortChange.subscribe(() => (this.paginator.pageIndex = 0));

    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        startWith({}),
        switchMap(() => {

          this.isLoadingResults = true;

          let bodydata: OrdersSearch = {
            fecha_inicio: sDate,
            fecha_fin: eDate,
            codigo_articulo: this.codigo_articulo.value !== null ? this.codigo_articulo.value : '',
            nombre_proveedor: this.nombre_proveedor.value !== null ? this.nombre_proveedor.value : '',
            tipo_movimiento: this.tipo_movimiento.value !== null ? this.tipo_movimiento.value : '',
            numero_remito: this.numero_remito.value !== null ? this.numero_remito.value : '',
            nombre_usuario: "",
            numero_orden: 0,
            longitud_pagina: this.paginator?.pageSize,
            numero_pagina: this.paginator?.pageIndex + 1,
            formato: 'json'
          };

          return this._articlesService.getOrders(bodydata)
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
          this.resultsLength = data.total_registros;
          return data.ordenes;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  findOrders() {

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingResults = true;
    this.isDownloadFileDisabled=false;

    let bodydata: OrdersSearch = {
      fecha_inicio: sDate,
      fecha_fin: eDate,
      codigo_articulo: this.codigo_articulo.value !== null ? this.codigo_articulo.value : '',
      nombre_proveedor: this.nombre_proveedor.value !== null ? this.nombre_proveedor.value : '',
      tipo_movimiento: this.tipo_movimiento.value !== null ? this.tipo_movimiento.value : '',
      numero_remito: this.numero_remito.value !== null ? this.numero_remito.value : '',
      nombre_usuario: "",
      numero_orden: 0,
      longitud_pagina: this.paginator?.pageSize,
      numero_pagina: this.paginator?.pageIndex + 1,
      formato: "json"
    };

    this._articlesService.getOrders(bodydata)
      .pipe(
        tap(data => {
          this.data = data.ordenes;

          this.pageNumber = data?.numero_pagina ?? 1;
          this.totalRecords = data?.total_registros ?? 0;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data?.cantidad_paginas ?? 0;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
        }),
        catchError(err => {
          console.log("Error cargando los datos de Ordenes ", err);
          alert("Error cargando los datos de Ordenes ");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  limpiarFilter() {

    this.formFilter.controls.codigo_articulo.setValue("");
    this.formFilter.controls.nombre_proveedor.setValue("");
    this.formFilter.controls.numero_remito.setValue("");
    this.formFilter.controls.tipo_movimiento.setValue("");
    this.startDate.setValue(new Date(2022, 0, 1));
    this.endDate.setValue(new Date());
  }

  verifyStartDate() {

    let startDate = this.startDate.value !== null ? this.startDate.value : new Date();
    let endDate = this.endDate.value !== null ? this.endDate.value : new Date();
    if (startDate > endDate) {
      alert("No puede seleccionar una fecha inicial superior a la final");
      this.startDate.setValue(this.endDate.value);
    }
  }

  verifyEndDate() {

    let startDate = this.startDate.value !== null ? this.startDate.value : new Date();
    let endDate = this.endDate.value !== null ? this.endDate.value : new Date();
    if (startDate > endDate) {
      alert("No puede seleccionar una fecha final inferior a la inicial");
      this.endDate.setValue(this.startDate.value);
    }
  }

  downloadFile() {

    this.isLoadingResults = true;
    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    let bodydata: OrdersSearch = {
      fecha_fin: eDate,
      fecha_inicio: sDate,
      longitud_pagina: 100000,
      numero_pagina: 1,
      formato: "csv",
      nombre_proveedor: this.nombre_proveedor.value ?? "",
      codigo_articulo: this.codigo_articulo.value ?? "",
      tipo_movimiento:  this.tipo_movimiento.value ?? "",
      nombre_usuario: "",
      numero_orden: 0,
      numero_remito: this.numero_remito.value ?? ""
    };

    const fileName = `Reporte_ordenes_${bodydata.fecha_inicio}_${bodydata.fecha_fin}.csv`

    this._fileManagerService.downloadFileOrdersListFilter(bodydata)
      .subscribe(response => {
        this.manageFile(response, fileName);
        this.isLoadingResults = false;
        this.isDownloadFileDisabled = true;
      });


  }

  manageFile(response: any, fileName: string): void {
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filePath = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));
    const downloadLink = document.createElement('a');
    downloadLink.href = filePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

}





import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';


import { SecurityService } from '../../services/security.service';
import { UserService } from '../../services/user.service';
import { ReportsService } from '../../services/reports.service';
import {FileManagerService} from '../../services/file-manager.service'
import { Router } from '@angular/router';
import { Global } from '../../services/global';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { Client, Cliente } from '../../interfaces/client.interface';
import { Product, Producto } from '../../interfaces/product.interface';
import { ReportSearch } from '../../interfaces/report.interface';
import { ResultadoPorCliente } from '../../interfaces/report.interface';


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

import {provideNativeDateAdapter} from '@angular/material/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';
import { catchError, finalize, tap, throwError } from 'rxjs';

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
  selector: 'app-reports-by-clients',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES],
  templateUrl: './reports-by-clients.component.html',
  styleUrl: './reports-by-clients.component.scss',
  providers: [UserService, SecurityService, FileManagerService, provideNativeDateAdapter()]
})
export class ReportsByClientsComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['cliente', 'imagenes', 'hojas'];
  public url: string;
  public data: ResultadoPorCliente[] = [];
  public pageNumber: number = 0;
  public totalRecords: any = 0;
  public pageLength: number = 20;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;
  public isDownloadFileDisabled: boolean=true;

  //String que levantan las listas de los menu desplegables
  public clientes: Cliente[] = [];
  public productos: Producto[] = [];
  //Variables para seleccionar listas
  public selectedClient: string = "";
  public selectedProduct: string = "";
  //Fechas
  startDate = new FormControl(new Date(2022,0,1));/* Creo con fecha inicial 01/01/2022 */
  endDate = new FormControl(new Date());/* Creo con fecha final la actual */
  
  datoSeleccionado: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  formFilter = this._formBuilder.group({
    clienteSeleccionado: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]]
  });

  
  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _reportsService: ReportsService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _fileManagerService: FileManagerService
  ) {
    this.url = Global.url;
  }


  get clienteSeleccionado() {
    return this.formFilter.controls['clienteSeleccionado'];
  }

  ngOnInit(): void {
    this.loadClients();
  }

  /*********************************TABLA*********************************************/

  loadClients() {
    this.isLoadingResults = true
    ;
    this._reportsService.getClients()
      .pipe(
        tap(data => {
          this.clientes = data.clientes;
          this.selectedClient = 'Todos';
          this.selectedProduct = 'Todos';
        }),
        catchError(err => {
          console.log("Error cargando los datos de Clientes ", err);
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
          let bodydata: ReportSearch = {
            cliente: this.selectedClient === "Todos" ? "" : this.selectedClient,
            fecha_fin: "",
            fecha_inicio: "",
            producto: "",
            tipo: "cliente",
            formato: "json",
            longitud_pagina: this.paginator?.pageSize,
            numero_pagina: this.paginator?.pageIndex + 1,
          };
  
          return this._reportsService.getReportsList(bodydata)
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
          //console.log(data.length);
          return data.resultadoPorCliente;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  findClients() {

    let sDate = this.startDate.value!==null?this.startDate.value.toISOString(): "";
    let eDate = this.endDate.value!==null?this.endDate.value.toISOString(): "";

    this.isLoadingResults = true;
    this.isDownloadFileDisabled=false;

    let bodydata: ReportSearch = {
      cliente: this.selectedClient === "Todos" ? "" : this.selectedClient,
      fecha_fin: eDate,
      fecha_inicio: sDate,
      producto: "",
      tipo: "cliente",
      formato: "json",
      longitud_pagina: this.paginator?.pageSize ?? 10,
      numero_pagina: 1
    };
    
    this._reportsService.getReportsListFilter(bodydata)
      .pipe(
        tap(data => {
          this.data = data.resultadoPorCliente;
          this.pageNumber = data.numero_pagina;
          this.totalRecords = data.total_registros;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data.cantidad_paginas;
        }),
        catchError(err => {
          console.log("Error cargando los datos de Reportes por Cliente ", err);
          alert("Error cargando los datos de Reportes por Cliente ");
          return throwError(err);
        }),
        finalize(() => this.isLoadingResults = false)
      )
      .subscribe();
  }

  onChangeClient() {
    this.isLoadingResults = true;
    this._reportsService.getProducts(this.selectedClient)
      .pipe(
        tap(product => {
          this.productos = product.productos;
          this.selectedProduct = 'Todos';
        }),
        catchError(err => {
          console.log("Error cargando los datos de productos ", err);
          alert("Error cargando los datos de productos ");
          return throwError(err);
        }),
        finalize(() => {

          this.isLoadingResults = false;
        })
      )
      .subscribe();
  }
  
  verifyStartDate(){

    let startDate = this.startDate.value!==null?this.startDate.value: new Date();
    let endDate = this.endDate.value!==null?this.endDate.value: new Date();
    if(startDate>endDate){
      alert("No puede seleccionar una fecha inicial superior a la final");
      this.startDate.setValue(this.endDate.value);
    }
  }

  verifyEndDate(){

    let startDate = this.startDate.value!==null?this.startDate.value: new Date();
    let endDate = this.endDate.value!==null?this.endDate.value: new Date();
    if(startDate>endDate){
      alert("No puede seleccionar una fecha final inferior a la inicial");
      this.endDate.setValue(this.startDate.value);
    }
  }
  
  downloadFile(){

    this.isLoadingResults = true;
    let sDate = this.startDate.value!==null?this.startDate.value.toISOString(): "";
    let eDate = this.endDate.value!==null?this.endDate.value.toISOString(): "";

    let bodydata: ReportSearch = {
      cliente: this.selectedClient === "Todos" ? "" : this.selectedClient,
      fecha_fin: eDate,
      fecha_inicio: sDate,
      producto: "",
      tipo: "cliente",
      formato: "csv",
      longitud_pagina: 100000,
      numero_pagina: 1
    };

    const fileName = `ReportexCliente_${bodydata.cliente}_${bodydata.fecha_inicio}_${bodydata.fecha_fin}.csv`

    this._fileManagerService.downloadReportsListFilterClient(bodydata)
      .subscribe(response=>{
        this.manageFile(response, fileName);
        this.isLoadingResults = false;
        this.isDownloadFileDisabled=true;
      });

      
  }

  manageFile(response: any, fileName: string): void{
    const dataType = response.type;
    const binaryData = [];
    binaryData.push(response);

    const filePath = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
    const downloadLink = document.createElement('a');
    downloadLink.href = filePath;
    downloadLink.setAttribute('download', fileName);
    document.body.appendChild(downloadLink);
    downloadLink.click();
  }

}


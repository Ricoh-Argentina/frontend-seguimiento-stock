import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { SecurityService } from '../../../services/security.service';
import { UserService } from '../../../services/user.service';
import { ReportsService } from '../../../services/reports.service';
import { VariablesService } from '../../../services/variables.service';
import { ArticlesService } from '../../../services/articles.service';
import { SuppliersService } from '../../../services/suppliers.service';
import { Router } from '@angular/router';
import { Global } from '../../../services/global';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { Rol, UnidadArticulo } from '../../../interfaces/variables.interface';
import { UserResponse, Usuario, UserSearch, UserUpdateResponse, UserUpdateInterface } from '../../../interfaces/user.interface';
import { ArticleSearch, ArticleResponse, Articulo, ArticleUpdateInterface, Proveedores, NewArticle } from '../../../interfaces/article.interface';


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
import { SupplierSearch } from '../../../interfaces/suppliers.interface';


const MATERIAL_MODULES = [MatCheckboxModule, MatSlideToggleModule, MatButtonModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule];


@Component({
  selector: 'app-editArticles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES],
  templateUrl: './editArticles.component.html',
  styleUrl: './editArticles.component.scss',
  providers: [ArticlesService, SecurityService, provideNativeDateAdapter()]
})
export class EditArticlesComponent implements OnInit, AfterViewInit {

  public displayedColumns: string[] = ['codigo', 'descripcion', 'proveedores'];
  public url: string;
  public data: Articulo[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 17;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;
  public isChecked: boolean = true;

  //Variables para seleccionar listas
  public selectedProveedor: string = "";
  public selectedUnidad: string = "";

  //String que levantan las listas de los menu desplegables
  public suppliers: Proveedores[] = [];
  public unidades: UnidadArticulo[] = [];

  public selectedTermino: string = "";

  //Fechas
  startDate = new FormControl(new Date());
  endDate = new FormControl(new Date());

  datoSeleccionado: boolean = false;

  //Form
  public isCheckedPassword: boolean = false;
  public isformEditArticleActive: boolean = true;
  public isAvailable: boolean = false;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;


  formFilter = this._formBuilder.group({
    termino: ['', [
      Validators.minLength(1),
      Validators.maxLength(40)
    ]]
  });

  formEditArticle = this._formBuilder.group({
    codigo: [{ value: '', disabled: false }, [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(50)
    ]],
    descripcion: [{ value: '', disabled: false }, [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(60)
    ]],
    unidad: [{ value: '', disabled: false }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(50)
    ]],
    proveedores: [{ value: [""], disabled: false }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(150)
    ]],
    cantidad: [{ value: 0, disabled: false }, [
      Validators.required,
      Validators.minLength(1),
      Validators.maxLength(20)
    ]]
  });

  constructor(
    private _securityService: SecurityService,
    private _articlesService: ArticlesService,
    private _suppliersService: SuppliersService,
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
    this.loadSuppliers();
    this.loadUnidades();
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
            this.suppliers = data.proveedores;
  
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
  
    loadUnidades() {
  
      this._variablesService.getUnidadArticulos()
        .pipe(
          tap(data => {
            this.unidades = data;
  
          }),
          catchError(err => {
            console.log("Error cargando las Unidades de proveedores ", err);
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

          let bodydata: ArticleSearch = {
            termino: "",
            longitud_pagina: this.paginator?.pageSize,
            numero_pagina: this.paginator?.pageIndex + 1,
          };

          return this._articlesService.getArticles(bodydata)
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
          return data.articulos;
        }),
      )
      .subscribe(data => (this.data = data));
  }

  findArticle() {

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingResults = true;

    let bodydata: ArticleSearch = {
      termino: this.termino.value !== null ? this.termino.value : "",
      longitud_pagina: this.paginator?.pageSize,
      numero_pagina: this.paginator?.pageIndex + 1,
    };

    this._articlesService.getArticles(bodydata)
      .pipe(
        tap(data => {
          this.data = data.articulos;

          this.pageNumber = data?.numero_pagina ?? 1;
          this.totalRecords = data?.total_registros ?? 0;
          this.pageLength = this.paginator?.pageSize;
          this.numberOfPages = data?.cantidad_paginas ?? 0;
          // Flip flag to show that loading has finished.
          this.isLoadingResults = false;
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

  get codigo() {
    return this.formEditArticle.controls['codigo'];
  }

  get descripcion() {
    return this.formEditArticle.controls['descripcion'];
  }

  get unidad() {
    return this.formEditArticle.controls['unidad'];
  }

  get proveedores() {
    return this.formEditArticle.controls['proveedores'];
  }

  get cantidad() {
    return this.formEditArticle.controls['cantidad'];
  }

  UpdateArticle() {

    let bodydata: ArticleUpdateInterface = {

      descripcion: this.descripcion.value !== null ? this.descripcion.value : '',
      unidad: this.unidad.value !== null ? this.unidad.value : '',
      cantidad: this.cantidad.value !== null ? this.cantidad.value : 0,
      proveedores: [...this.selectedProveedor],
    };

    this._articlesService.updateArticle(bodydata, this.codigo.value !== null ? this.codigo.value : '').subscribe(
      {
        next: (resultado) => {
          alert("Modificacion de articulo exitosa");
          this.formEditArticle.reset();
        },
        error: (error) => {
          if (error.status == 403 || error.status == 401) {

            alert("ERROR al modificar el articulo!!!");
          }
        },
        complete: () => console.info('Peticion Completada')
      }
    );
  }

  clickedRow(row: Articulo) {
    
    /* MODIFICAR: esta asignacion cuando se modifique */
    const proveedoresString: string[]= row.proveedores.map((p)=>{
      return p.nombre_proveedor;
    });
    
    this.formEditArticle.controls.codigo.setValue(row.codigo);
    this.formEditArticle.controls.descripcion.setValue(row.descripcion);
    this.formEditArticle.controls.unidad.setValue(row.unidad);
    this.formEditArticle.controls.cantidad.setValue(row.cantidad);  
    this.formEditArticle.controls.proveedores.setValue(proveedoresString);
    this.isformEditArticleActive = false;
  }

  CancelForm() {
    this.formEditArticle.controls.codigo.setValue("");
    this.formEditArticle.controls.descripcion.setValue("");
    this.formEditArticle.controls.unidad.setValue("");
    this.formEditArticle.controls.cantidad.setValue(0);
    this.formEditArticle.controls.proveedores.setValue([]);
    this.isformEditArticleActive = true;
    this.isCheckedPassword = false;
  }
}

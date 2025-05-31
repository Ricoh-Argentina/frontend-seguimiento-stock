import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

import { merge, Observable, of as observableOf } from 'rxjs';
import { map, startWith, switchMap } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

import { SecurityService } from '../../../services/security.service';
import { ArticlesService } from '../../../services/articles.service';
import { Router } from '@angular/router';
import { Global } from '../../../services/global';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';

import { Client } from '../../../interfaces/client.interface';
import { Product } from '../../../interfaces/product.interface';

import { ArticleSearch, ArticleResponse, Articulo } from '../../../interfaces/article.interface';


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
import {provideNativeDateAdapter} from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button'
/* Tabla varias filas en cada fila */
import {animate, state, style, transition, trigger} from '@angular/animations';

import { FormBuilder, Validators, FormsModule, ReactiveFormsModule, FormControl, FormGroup } from '@angular/forms';

import { catchError, finalize, tap, throwError } from 'rxjs';


const MATERIAL_MODULES = [MatButtonModule, MatDatepickerModule, MatSelectModule, MatTableModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSortModule, MatPaginatorModule, MatProgressSpinnerModule];


@Component({
  selector: 'app-listArticles',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule, MATERIAL_MODULES],
  templateUrl: './listArticles.component.html',
  styleUrl: './listArticles.component.scss',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [SecurityService, ArticlesService, provideNativeDateAdapter()]
})
export class ListArticlesComponent implements OnInit, AfterViewInit {
  public displayedColumns: string[] = ['codigo', 'descripcion', 'unidad', 'cantidad_total', 'proveedores', 'esta_activo'];
  public displayedColumnsAux: string[] = ['nombre_proveedor', 'cantidad', 'esta_activo'];
  public displayedColumnsWithExpand: string [] = [...this.displayedColumns, 'expand'];
  public url: string;
  public data: Articulo[] = [];
  public pageNumber: number = 0;
  public totalRecords: number = 0;
  public pageLength: number = 19;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;
  
  datoSeleccionado: boolean = false;

  /* Tabla expansion */
  public expandedElement: Articulo[] | null = [];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private _securityService: SecurityService,
    private _articlesService: ArticlesService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.url = Global.url;
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

  

}

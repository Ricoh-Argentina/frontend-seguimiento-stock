import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { SecurityService } from '../../services/security.service';
import { ReportsService } from '../../services/reports.service';
import { Router } from '@angular/router';
import { Global } from '../../services/global';
import { Ejecucion, MinimalSearch, ResultadoPorEjecucion, UpdateDestinatariosDTO } from '../../interfaces/report.interface';
import { catchError, finalize, tap, throwError } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DestinatariosDialogComponent } from '../dialogs/destinatarios/destinatarios.component';

const MATERIAL_MODULES = [
  MatTableModule,
  MatIconModule,
  MatSortModule,
  MatPaginatorModule,
  HttpClientModule,
  MatProgressSpinnerModule, MatCardModule, MatButtonModule, MatIconModule,
  MatButtonModule
];



@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [CommonModule, MATERIAL_MODULES],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.scss'
})
export class ScheduleComponent {

  public url: string;
  public data: Ejecucion[] = [];
  public pageNumber: number = 1;
  public totalRecords: any = 0;
  public pageLength: number = 20;
  public numberOfPages: number = 0;
  public isLoadingResults: boolean = true;
  public resultsLength = 0;
  public isRateLimitReached = false;
  public isDownloadFileDisabled: boolean = true;
  public destinatarios: string[] = [];
  public defaultReport = 1; //RUF (Reserved to Future Use)


  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  public displayedColumns: string[] = ['FechaHora', 'Reporte', 'Periodicidad', 'Destinatarios', 'Resultado', 'Detalle'];

  constructor(
    private _securityService: SecurityService,
    private _reportsService: ReportsService,
    private _router: Router,
    private dialog: MatDialog
  ) {
    this.url = Global.url;
  }


  ngOnInit() {
    this.loadTasks();
    this.loadExecutions();
  }

  loadTasks() {
    this._reportsService.getReportById(this.defaultReport)
      .pipe(
        tap(data => {
          this.destinatarios = data.destinatarios;
        })
      ).subscribe();
  }

  loadExecutions() {
    const search: MinimalSearch = {
      longitud_pagina: this.pageLength,
      numero_pagina: this.pageNumber
    }
    this._reportsService.getExecutions(search).pipe(
      tap(data => {
        this.data = data.ejecuciones;
        this.pageNumber = data.numero_pagina;
        this.totalRecords = data.total_registros;
        this.pageLength = this.paginator?.pageSize;
        this.numberOfPages = data.cantidad_paginas;
      })
    ).subscribe();
  }

  executeReport() {
    this._reportsService.executeReport()
      .subscribe({
        next: () => {
          alert("Ejecutado correctamente.");
          this.ngOnInit();
        },
        error: (err) => {
          console.log(err);
          alert("Error al ejecutar la tarea programada, revise el listado de ejecuciones para más detalles.");
          this.ngOnInit();
        }
      });
  }

  updateDestinatarios(destinatarios: string[]) {
    const _destinatarios: UpdateDestinatariosDTO = {
      destinatarios
    }

    this._reportsService.updateDestinatarios(this.defaultReport, _destinatarios)
      .pipe(
        tap(() => {
          alert("Destinatarios actualizados!");
          this.ngOnInit();
        }),
        catchError(err => {
          alert("Error al cambiar destinarios, consulte al administrador.");
          return throwError(err);
        }),
      ).subscribe();
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DestinatariosDialogComponent, {
      width: '25vw',     // ejemplo: 80% del viewport
      maxWidth: '25vw',  // evita que quede más chico por default
      height: 'auto',
      panelClass: 'my-wide-dialog',
      data: { values: this.destinatarios },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (!result) { return; }
      this.updateDestinatarios(result);
    });
  }
}



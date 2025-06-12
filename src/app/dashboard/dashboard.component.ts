import { Component, Inject, OnInit } from '@angular/core';

import { DashboardService } from '../services/dashboard.service';

import { UserService } from '../services/user.service';
import { SecurityService } from '../services/security.service';
import { DataChartXClient } from '../interfaces/dashboard.interface';
import { DataChartSolutionCenter } from '../interfaces/dashboard.interface';
import { DataChartSearh } from '../interfaces/dashboard.interface';
import { Router } from '@angular/router';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { FileManagerService } from '../services/file-manager.service';
import { Global } from '../services/global';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';

import { Chart } from 'chart.js/auto';

const MATERIAL_MODULES = [MatButtonModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule];

const months = [
  {
    id: 1,
    mes: "Enero"
  },
  {
    id: 2,
    mes: "Febrero"
  },
  {
    id: 3,
    mes: "Marzo"
  },
  {
    id: 4,
    mes: "Abril"
  },
  {
    id: 5,
    mes: "Mayo"
  },
  {
    id: 6,
    mes: "Junio"
  },
  {
    id: 7,
    mes: "Julio"
  },
  {
    id: 8,
    mes: "Agosto"
  }, {
    id: 9,
    mes: "Septiembre"
  },
  {
    id: 10,
    mes: "Octubre"
  },
  {
    id: 11,
    mes: "Noviembre"
  },
  {
    id: 12,
    mes: "Diciembre"
  }
];

/******************************************/
/* Cambiar la siguiente variable para que */
/* Tome los años que hay en la DB o que   */
/* Agregue cada año nuevo                 */
/******************************************/
const years = [2023, 2024, 2025];

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  public url: string;
  public months: any[] = months;
  public years: number[] = years;
  //Variables para seleccionar listas
  public selectedMonth!: number;
  public selectedYear!: number;

  //Fechas
  startDate = new FormControl(new Date(2022, 0, 1));/* Creo con fecha inicial 01/01/2022 */
  endDate = new FormControl(new Date());/* Creo con fecha final la actual */
  monthActual = new Date().getMonth()+1; /* Creo el mes actual para la consulta del grafico inicial */
  yearActual = new Date().getFullYear(); /* Creo el año actual para la consulta del grafico inicial */

  //Chart
  public myChart1: any;
  public myChart2: any;
  public dataChartSolutionCenter!: DataChartSolutionCenter;
  public dataChartClient!: DataChartXClient;
  public isLoadingChart1: boolean = false;
  public isLoadingChart2: boolean = false;

  //KPI
  public QtyClients: number =0;
  public QtyImagesMonthBefore: number =0;
  public QtyImagesMonthActual: number =0;

  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _dashboardService: DashboardService,
    private _router: Router,
    private _formBuilder: FormBuilder,
    private _fileManagerService: FileManagerService
  ) {
    this.url = Global.url;
  }

  ngOnInit(): void {
    this.selectedMonth = this.monthActual;
    this.selectedYear = this.yearActual;
    this.loadKpis();
    this.loadDataChartSolutionCenter();
    this.loadDataChartClients();
  }

  loadKpis(){

    this._dashboardService.getClients()
    .subscribe(
      {
        next: (data) => {
          const clients = data.clientes.filter((c) => c.estado === true);
          this.QtyClients = clients.length;
        },
        error: (error) => {
          if (error.status == 400 || error.status == 403 || error.status == 401) {
            alert("Su sesión ha expirado.");
            this._securityService.logout();
            this._router.navigateByUrl("/");
          }
        },
        complete: () => {
          //this.isLoadingChart1 = false;
        }
      }
    );

    this._dashboardService.getDashboardImpresionPlanta()
      .subscribe(
        {
          next: (data) => {
            this.QtyImagesMonthActual = data.imagenes[0];
            this.QtyImagesMonthBefore = data.imagenes[1];
          },
          error: (error) => {
            if (error.status == 400 || error.status == 403 || error.status == 401) {
              alert("Su sesión ha expirado.");
              this._securityService.logout();
              this._router.navigateByUrl("/");
            }
          },
          complete: () => {
            //this.isLoadingChart1 = false;
          }
        }
      );
  }

  loadDataChartSolutionCenter() {

    this.isLoadingChart1 = true;

    this._dashboardService.getDashboardImpresionPlanta()
      .subscribe(
        {
          next: (data) => {
            this.dataChartSolutionCenter = data;
            this.RenderChart1Simple(this.dataChartSolutionCenter.mes, this.dataChartSolutionCenter.imagenes, this.dataChartSolutionCenter.color, "imagenes", "bar", "barchart1");
          },
          error: (error) => {
            if (error.status == 400 || error.status == 403 || error.status == 401) {
              alert("Su sesión ha expirado.");
              this._securityService.logout();
              this._router.navigateByUrl("/");
            }
          },
          complete: () => {
            this.isLoadingChart1 = false;
          }
        }
      );

  }

  loadDataChartClients() {

    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingChart2 = true;

    let bodydata: DataChartSearh = {
      m: this.monthActual,
      a: this.yearActual
    };

    this._dashboardService.getDashboardImpresionClient(bodydata)
      .subscribe(
        {
          next: (data) => {
            this.dataChartClient = data;
            //this.UpdateChart(this.myChart2 ,this.dataChartClient.clientes, this.dataChartClient.imagenes, this.dataChartClient.color);
            this.RenderChart2Simple(this.dataChartClient.clientes, this.dataChartClient.imagenes, this.dataChartClient.color, "imagenes", "bar", "barchart2");
          },
          error: (error) => {
            if (error.status == 400 || error.status == 403 || error.status == 401) {
              alert("Su sesión ha expirado.");
              this._securityService.logout();
              this._router.navigateByUrl("/");
            }
          },
          complete: () => {
            this.isLoadingChart2 = false;
          }
        }
      );
  }

  onChangeMonth() {

  }

  onChangeYear() {

  }

  changeData() {
    let sDate = this.startDate.value !== null ? this.startDate.value.toISOString() : "";
    let eDate = this.endDate.value !== null ? this.endDate.value.toISOString() : "";

    this.isLoadingChart2 = true;

    let bodydata: DataChartSearh = {
      m: this.selectedMonth,
      a: this.selectedYear
    };

    this._dashboardService.getDashboardImpresionClient(bodydata)
      .subscribe(
        {
          next: (data) => {
            this.dataChartClient = data;
            this.UpdateChart2(this.dataChartClient.clientes, this.dataChartClient.imagenes, this.dataChartClient.color);
            //this.RenderChartSimple(this.myChart2, this.dataChartClient.clientes, this.dataChartClient.imagenes, this.dataChartClient.color, "imagenes", "bar", "barchart2");
          },
          error: (error) => {
            if (error.status == 400 || error.status == 403 || error.status == 401) {
              alert("Su sesión ha expirado.");
              this._securityService.logout();
              this._router.navigateByUrl("/");
            }
          },
          complete: () => {
            this.isLoadingChart2 = false;
          }
        }
      );
  }

  /**********************************************************************************************************************************************/
  /*                                                   Funciones para el Chart                                                                  */
  /**********************************************************************************************************************************************/

  // Funcion que crea y renderiza un grafico en un chart1, se le debe pasar un array de labels, de valores y colores, además de pasarle el id del canvas donde va 
  // a renderizar
  RenderChart1Simple(labelData: any, valueData: any, colorData: any, unitData: any, type: any, id: any) {
    this.myChart1 = new Chart(id, {
      type: type,
      data: {
        labels: labelData,
        datasets: [{
          label: unitData,
          data: valueData,
          backgroundColor: colorData,
          borderColor: colorData,
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  // Funcion que crea y renderiza un grafico en un chart2, se le debe pasar un array de labels, de valores y colores, además de pasarle el id del canvas donde va 
  // a renderizar
  RenderChart2Simple(labelData: any, valueData: any, colorData: any, unitData: any, type: any, id: any) {
    this.myChart2 = new Chart(id, {
      type: type,
      data: {
        labels: labelData,
        datasets: [{
          label: unitData,
          data: valueData,
          backgroundColor: colorData,
          borderColor: colorData,
          borderWidth: 2
        }]
      },
      options: {
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }

  //Funcion que ante un cambio de valores vuelve a renderizar el chart1
  UpdateChart1(labelData: any, valueData: any, colorData: any) {
    this.myChart1.data.labels = labelData;
    this.myChart1.data.datasets[0].backgroundColor = colorData;
    this.myChart1.data.datasets[0].borderColor = colorData;
    this.myChart1.data.datasets[0].data = valueData;
    this.myChart1.update();
  }

  //Funcion que ante un cambio de valores vuelve a renderizar el chart2
  UpdateChart2(labelData: any, valueData: any, colorData: any) {
    this.myChart2.data.labels = labelData;
    this.myChart2.data.datasets[0].backgroundColor = colorData;
    this.myChart2.data.datasets[0].borderColor = colorData;
    this.myChart2.data.datasets[0].data = valueData;
    this.myChart2.update();
  }

}

import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Chart } from 'chart.js/auto';

const MATERIAL_MODULES = [MatButtonModule, MatSelectModule, MatFormFieldModule, MatIconModule, MatInputModule, MatProgressSpinnerModule];

@Component({
  selector: 'app-bar-chart',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MATERIAL_MODULES],
  templateUrl: './bar-chart.component.html',
  styleUrl: './bar-chart.component.scss'
})
export class BarChartComponent implements OnInit, OnChanges {

  public isLoading: boolean = true;
  public myChart: any;

  ngAfterViewInit(){
    //this.isLoading=false;
    this.RenderChartSimple([], [], [], "imagenes", "bar", this._id);
    
  }
  ngOnChanges(changes: SimpleChanges): void {

    if (this.data && !this.isLoading) {
      //this.RenderChartSimple(this.data.mes, this.data.imagenes, this.data.color, "imagenes", "bar", "barchart1");
      this.renderChart();
    }
  }

  @Input({ required: true }) data: any[]=[];
  @Input({ required: true }) labels: any[]=[];
  @Input({ required: true }) colors: any[]=[];
  @Input() _id!: string;

  ngOnInit(): void {
    
  }


  RenderChartSimple(labelData: any, valueData: any, colorData: any, unitData: any, type: any, id: any) {
    console.log({labelData, valueData, colorData, unitData, type, id});
    this.myChart = new Chart(id, {
      type: type,
      data: {
        labels: labelData,
        datasets: [{
          label: unitData,
          data: valueData,
          /*backgroundColor: [
            'rgba(255, 99, 132, 0.2',
            'rgba(54, 162, 235, 0.2',
            'rgba(255, 206, 86, 0.2',
            'rgba(75, 192, 192, 0.2',
            'rgba(153, 102, 255, 0.2',
            'rgba(255, 159, 64, 0.2'
          ],*/
          backgroundColor: colorData,
          /*borderColor: [
            'rgba(255, 99, 132, 1',
            'rgba(54, 162, 235, 1',
            'rgba(255, 206, 86, 1',
            'rgba(75, 192, 192, 1',
            'rgba(153, 102, 255, 1',
            'rgba(255, 159, 64, 1'
          ],*/
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
    this.isLoading=false;
  }

  RenderChartDoble(labelData: any, valueData1: any, colorData1: any, type1: any, valueData2: any, colorData2: any, type2: any, id: any) {

    this.myChart = new Chart(id, {
      data: {
        datasets: [{
          type: type1,
          label: 'Grafico 1',
          data: valueData1,
          backgroundColor: colorData1,
          borderColor: colorData1,
          borderWidth: 2
        }, {
          type: type2,
          label: 'Grafico 2',
          data: valueData2,
          backgroundColor: colorData2,
          borderColor: colorData2,
          borderWidth: 2
        }],
        labels: labelData
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

  renderChart() {
    //console.log({labels: this.labels, valueData, colorData, unitData, type, id});
    this.myChart.data.labels=this.labels;
    this.myChart.data.datasets[0].backgroundColor=this.colors;
    this.myChart.data.datasets[0].borderColor=this.colors;
    this.myChart.data.datasets[0].data = this.data;
    this.myChart.update();
  }
}
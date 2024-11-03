import { Component, inject } from '@angular/core';
import { Chart, ChartType } from 'chart.js/auto';
import { Jatetxea } from './../home/jatetxe';
import { JatetxeService } from '../jatetxe.service';


@Component({
  selector: 'app-bar-chart',
  templateUrl: './charts.component.html',
  styleUrls: ['./charts.component.scss']
})
export class ChartsComponent{

  public chart!: Chart;
  jatetxeService = inject(JatetxeService);
  constructor() {


    // Llamamos al servicio para obtener los datos de las empresas
    this.jatetxeService.getJatetxeak().subscribe((data: Jatetxea[]) => {
      // Agrupamos los datos por municipio
      const municipioCount = data.reduce((acc: { [key: string]: number }, item: Jatetxea) => {
        const municipio = item.municipality; // Suponiendo que el campo del municipio en `Jatetxea` se llama `municipio`
        acc[municipio] = (acc[municipio] || 0) + 1;
        return acc;
      }, {});

      // Extraemos los nombres de los municipios y los conteos
      const labels = Object.keys(municipioCount);
      const chartData = Object.values(municipioCount);

      // Configuración de los datos para el gráfico
      const chartConfig = {
        labels: labels,
        datasets: [{
          label: 'Cantidad de Empresas por Municipio',
          data: chartData,
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        }]
      };

      // Crear el gráfico con los datos procesados
      this.chart = new Chart("chart", {
        type: 'bar' as ChartType,
        data: chartConfig
      });
    });
  }
}

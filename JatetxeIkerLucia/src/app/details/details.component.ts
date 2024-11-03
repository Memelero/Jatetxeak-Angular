import { Jatetxea } from './../home/jatetxe';
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JatetxeService } from '../jatetxe.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'] // Cambiado a styleUrls
})
export class DetailsComponent {
  route: ActivatedRoute = inject(ActivatedRoute);
  jatetxeService = inject(JatetxeService);
  jatetxea: Jatetxea | undefined;
  solicitudes: any[] = [];

  constructor() {
    const jatetxeaId = String(this.route.snapshot.params['id']); // Convertimos el ID a número
    console.log(`ID del restaurante: ${jatetxeaId}`); // Verificar que ID se recibe
    this.jatetxeService.getJatetxeaById(jatetxeaId).subscribe(data => {
      this.jatetxea = data;
      if (this.jatetxea) {
        this.solicitudes = this.jatetxeService.getApplicationsByHouseId(this.jatetxea.id);
      }
    });
  }
}

import { Component, inject, Input } from '@angular/core';
import { JatetxeService } from '../jatetxe.service';
import { Jatetxea } from '../home/jatetxe';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterOutlet, NgxPaginationModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  @Input() Jatetxea!: Jatetxea;
  originalJatetxeakList: Jatetxea[] = [];
  jatetxeakList: Jatetxea[] = [];
  uniqueMunicipalities: Jatetxea[] = [];
  filterText: string = '';
  jatetxeakKopurua: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  jatetxeService: JatetxeService = inject(JatetxeService);
  router: Router = inject(Router);
  sortOrder: 'asc' | 'desc' = 'asc';

  constructor() {
    this.jatetxeService.getJatetxeak().subscribe((data: Jatetxea[]) => {
      this.jatetxeakList = data;
      this.originalJatetxeakList = data;
      this.jatetxeakKopurua = this.jatetxeakList.length;
      this.uniqueMunicipalities = data;
      this.getUniqueMunicipalities();
      console.log(this.jatetxeakList)
  })
  }
  // Navega a la página de detalles de un restaurante con el ID proporcionado
  navigateToDetails(jatetxeakId: string) {
    this.router.navigate(['/details', jatetxeakId]);
  }
  // Filtra los restaurantes por el municipio seleccionado en el dropdown
  selectMunicipality(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    this.filterText = selectElement.value;
    this.filterByCity();
  }
  // Filtra la lista de restaurantes por el valor de `filterText` (municipio o nombre del documento)
  filterByCity() {
    if (this.filterText.trim()) {
      this.jatetxeakList = this.originalJatetxeakList.filter(jatetxe =>
        jatetxe.municipality.toLowerCase().includes(this.filterText.toLowerCase()) ||
        jatetxe.documentName.toLowerCase().includes(this.filterText.toLowerCase())
      );
    } else {
      this.jatetxeService.getJatetxeak().subscribe((data: Jatetxea[]) => {
        this.jatetxeakList = this.originalJatetxeakList;
        this.jatetxeakKopurua = this.jatetxeakList.length;
      });
    }
    this.jatetxeakKopurua = this.jatetxeakList.length;
    this.currentPage = 1;
  }

  get paginatedJatetxeak() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.jatetxeakList.slice(startIndex, startIndex + this.itemsPerPage);
  }

  changePage(page: number) {
    this.currentPage = page;
  }

  get totalPages() {
    return Math.ceil(this.jatetxeakKopurua / this.itemsPerPage);
  }

  // Alterna el orden de la lista entre ascendente y descendente
  modificarOrden() {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    this.sortList();
  }

  sortList() {
    this.jatetxeakList.sort((a, b) => {
      const nameA = a.documentName.toLowerCase();
      const nameB = b.documentName.toLowerCase();
      if (this.sortOrder === 'asc') {
        return nameA < nameB ? -1 : nameA > nameB ? 1 : 0;
      } else {
        return nameA > nameB ? -1 : nameA < nameB ? 1 : 0;
      }
    });
  }
  getUniqueMunicipalities() {
    const uniqueMunicipalities = this.originalJatetxeakList
      .filter((value, index, self) =>self.findIndex(v => v.municipality === value.municipality) === index)  // Filtra duplicados por municipio
      .sort((a, b) => a.municipality.localeCompare(b.municipality));  // Ordena alfabéticamente por el nombre del municipio

    this.uniqueMunicipalities = uniqueMunicipalities;  // Asignamos la lista de municipios únicos a la propiedad
  }
}

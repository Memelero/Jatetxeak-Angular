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
  filterText: string = '';
  jatetxeakKopurua: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 8;
  jatetxeService: JatetxeService = inject(JatetxeService);
  router: Router = inject(Router);

  constructor() {
    this.jatetxeService.getJatetxeak().subscribe((data: Jatetxea[]) => {
      this.jatetxeakList = data;
      this.originalJatetxeakList = data;
      this.jatetxeakKopurua = this.jatetxeakList.length;
      console.log(this.jatetxeakList)
  })
  }
  navigateToDetails(jatetxeakId: string) {
    this.router.navigate(['/details', jatetxeakId]);
  }

  selectMunicipality(event: Event) {
    const selectElement = event.target as HTMLSelectElement; // Asegúrate de que sea un HTMLSelectElement
  this.filterText = selectElement.value; // Obtiene el valor seleccionado
  this.filterByCity();
  }
  filterByCity() {
    if (this.filterText.trim()) {
      this.jatetxeakList = this.originalJatetxeakList.filter(jatetxe =>
        jatetxe.municipality.toLowerCase().includes(this.filterText.toLowerCase())
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

}

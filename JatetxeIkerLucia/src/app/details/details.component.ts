import { Jatetxea } from './../home/jatetxe';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { JatetxeService } from '../jatetxe.service';
import Swal from 'sweetalert2';
import confetti from 'canvas-confetti';

const defaults = {
  spread: 360,
  ticks: 50,
  gravity: 0,
  decay: 0.94,
  startVelocity: 30,
  shapes: ["star"],
  colors: ["FFE400", "FFBD00", "E89400", "FFCA6C", "FDFFB8"],
};

function shoot() {
  confetti({
    ...defaults,
    particleCount: 40,
    scalar: 1.2,
    shapes: ["star"],
  });

  confetti({
    ...defaults,
    particleCount: 10,
    scalar: 0.75,
    shapes: ["circle"],
  });
}

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css']
})
export class DetailsComponent implements OnInit {
  jatetxea: Jatetxea | undefined;
  solicitudes: any[] = [];
  dishes: any[] = [];

  constructor(private route: ActivatedRoute,private jatetxeService: JatetxeService) {}

  ngOnInit(): void {
    const jatetxeaId = String(this.route.snapshot.params['id']);
    console.log(`ID del restaurante: ${jatetxeaId}`);
    this.jatetxeService.getJatetxeaById(jatetxeaId).subscribe(data => {
      this.jatetxea = data;
      if (this.jatetxea) {
        this.solicitudes = this.jatetxeService.getApplicationsByHouseId(this.jatetxea.id);
      }
      this.loadDishes();
    });
  }

  addDish() {
    Swal.fire({
      title: 'Añadir Plato',
      html: `
        <input type="text" id="dish-name" class="swal2-input" placeholder="Platerraren izena">
        <input type="number" id="dish-price" class="swal2-input" placeholder="Platerraren prezioa">
        <input type="text" id="dish-url" class="swal2-input" placeholder="Platerraren url">
      `,
      confirmButtonText: 'Gorde',
      focusConfirm: false,
      preConfirm: () => {
        const name = (document.getElementById('dish-name') as HTMLInputElement).value;
        const price = parseFloat((document.getElementById('dish-price') as HTMLInputElement).value);
        const url = (document.getElementById('dish-url') as HTMLInputElement).value;

        if (!name || isNaN(price) || !url) {
          Swal.showValidationMessage('Mesedez, bete eremu guztiak behar bezala');
          return;
        }

        return { name, price, url };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        const newDish = result.value;
        const jatetxeaId = this.jatetxea?.id;

        const dishData = {
          ...newDish,
          jatetxeaId: jatetxeaId
        };

        const existingDishes = JSON.parse(localStorage.getItem('dishes') || '[]');
        existingDishes.push(dishData);
        localStorage.setItem('dishes', JSON.stringify(existingDishes));

        console.log('Plato guardado en localStorage:', dishData);
        setTimeout(shoot, 0);
        setTimeout(shoot, 100);
        setTimeout(shoot, 200);

        this.loadDishes();
      }
    });
  }

  loadDishes() {
    const existingDishes = JSON.parse(localStorage.getItem('dishes') || '[]');
    this.dishes = existingDishes.filter((dish: any) => dish.jatetxeaId === this.jatetxea?.id);
  }
}

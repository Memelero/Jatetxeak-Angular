import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Jatetxea } from './home/jatetxe';

@Injectable({
  providedIn: 'root'
})
export class JatetxeService {

  private _historialHouse: Jatetxea[] = [];
  private apiUrl = 'http://localhost:3000/jatetxeak';

  constructor(private http: HttpClient) {
    const historial = localStorage.getItem('historialHouse');
    if (historial) {
      this._historialHouse = JSON.parse(historial);
    }
  }

  getJatetxeak(): Observable<Jatetxea[]> {
    return this.http.get<Jatetxea[]>(this.apiUrl);
  }


  // Método para obtener y mostrar datos en consola usando la interfaz Jatetxea
  mostrarDatosEnConsola(): void {
    this.http.get<Jatetxea[]>(this.apiUrl).subscribe(
      (data) => {
        console.log('Datos obtenidos (Iker eta Lucia):', data);
      },
      (error) => {
        console.error('Error al obtener datos:', error);
      }
    );
  }


getJatetxeaById(id: string): Observable<Jatetxea | undefined> {
  console.log("paso por el servicio")
  return this.http.get<Jatetxea | undefined>(`${this.apiUrl}/${id}`);
}
getApplicationsByHouseId(jatetxeId: string): any[] {
  return this._historialHouse.filter(solicitud => String(solicitud.id) === jatetxeId);
}
}

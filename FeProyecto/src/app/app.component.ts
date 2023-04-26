import { Component, OnInit } from '@angular/core';
import { UbicacionesService } from './ubicaciones/ubicaciones/ubicaciones.service';
import { Ubicacion } from './ubicaciones/ubicaciones/ubicacion.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private ubicacionesSubscription!: Subscription;
  ubicacionesData: Ubicacion[] = [];
  constructor(private ubicacionesService: UbicacionesService) {
  }
  ngOnInit(): void {
    this.ubicacionesService.obtenerUbicacionesList();

    this.ubicacionesSubscription = this.ubicacionesService.obtenerActualListener().subscribe((ubicaciones: Ubicacion[]) => {
      this.ubicacionesData = ubicaciones;
    });
  }
  title = 'Front-Proyecto';
}

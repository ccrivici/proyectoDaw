import { Component, OnInit } from '@angular/core';
import { UbicacionesService } from './ubicaciones/ubicaciones/ubicaciones.service';
import { Ubicacion } from './ubicaciones/ubicaciones/ubicacion.model';
import { Subscription } from 'rxjs';
import { SeguridadService } from './seguridad/seguridad.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private ubicacionesSubscription!: Subscription;
  ubicacionesData: Ubicacion[] = [];
  constructor(private ubicacionesService: UbicacionesService,private seguridadService: SeguridadService) {
  }
  ngOnInit(): void {
    this.seguridadService.cargarUsuario();
    this.ubicacionesService.obtenerUbicacionesList();

    this.ubicacionesSubscription = this.ubicacionesService.obtenerActualListener().subscribe((ubicaciones: Ubicacion[]) => {
      this.ubicacionesData = ubicaciones;
    });
  }
  title = 'Front-Proyecto';
}

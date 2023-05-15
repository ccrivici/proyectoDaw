import { Component, OnInit } from '@angular/core';
import { UbicacionesService } from './ubicaciones/ubicaciones/ubicaciones.service';
import { Ubicacion } from './ubicaciones/ubicaciones/ubicacion.model';
import { Subscription } from 'rxjs';
import { SeguridadService } from './seguridad/seguridad.service';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  private ubicacionesSubscription!: Subscription;
  ubicacionesData: Ubicacion[] = [];
  ubicaciones: any;
  constructor(private ubicacionesService: UbicacionesService,private seguridadService: SeguridadService,private router: Router) {
  }
  ngOnInit(): void {
    this.seguridadService.cargarUsuario();
    this.ubicacionesService.obtenerUbicacionesList();

    this.ubicacionesSubscription = this.ubicacionesService.obtenerActualListener().subscribe((ubicaciones: Ubicacion[]) => {
      this.ubicacionesData = ubicaciones;
    });
  }
  title = 'Front-Proyecto';
  mostrarPagActual() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        const rutaActiva = this.router.url;
        const rutaSinBarraInicial = rutaActiva.substring(1);
        const rutaSeparadaPorBarras = rutaSinBarraInicial.split('/');
        let nombreRuta = '';

        if (rutaSeparadaPorBarras.length > 0) {
          const primeraParteRuta = rutaSeparadaPorBarras[0];

          // Verificar si la primera parte de la ruta está vacía y establecer "Inicio" como texto
          if (primeraParteRuta === '') {
            nombreRuta = 'Inicio';
          } else {
            // Si no está vacía, capitalizar la primera letra
            nombreRuta = `${primeraParteRuta.charAt(0).toUpperCase()}${primeraParteRuta.slice(1)}`;
          }

          if (rutaSeparadaPorBarras.length > 1) {
            const idUbicacion = rutaSeparadaPorBarras[rutaSeparadaPorBarras.length - 1];
            if (this.ubicaciones) {
              const ubicacion = this.ubicaciones.find((u) => u.id === idUbicacion);
              if (ubicacion) {
                nombreRuta += ` - ${ubicacion.nombre}`;
              }
            }
          }
        }

        // Actualizar el contenido del elemento con la clase .info_actual
        const infoActualElement = document.querySelector('.info_actual');
        if (infoActualElement) {
          infoActualElement.textContent = nombreRuta;
        }
      }
    });
  }
}

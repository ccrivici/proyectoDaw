import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Item } from 'src/app/items/items/item.model';
import { ItemsService } from 'src/app/items/items/items.service';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { PaginationUbicaciones } from './pagination-ubicaciones.model';
import { PuertoService } from './puerto.service';

@Component({
  selector: 'app-puerto',
  templateUrl: './puerto.component.html',
  styleUrls: ['./puerto.component.css']
})
export class PuertoComponent implements OnInit, OnDestroy {
  idUbicacion!: string;
  ubicacion!: any;
  desplegarColumnas = ["denominacion", 'ubicacion', 'conjuntoEquipo', 'equipo', 'marcaModelo', 'periocidad', 'categoria', 'modificar', 'eliminar'];
  dataSource = new MatTableDataSource<Item>();
  puertosData: Ubicacion[] = [];
  //paginacion
  totalPuertos = 0;
  puertosPorPagina = 2;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'titulo';
  sortDirection = 'asc';
  filterValue = {
    propiedad: "tipo",
    valor: "puerto"
  }
  //variable para mostrar items o mantenimientos
  mostrar = true;
  //desplegarColumnasPuerto=["Nombre","Tipo","Ver Items", "Ver Mantenimientos"];
  desplegarColumnasPuerto = ["nombre", "items","añadir", "mantenimientos","ubicacion"];
  dataSourcePuertos = new MatTableDataSource<Ubicacion>();
  puertasos: Ubicacion[] = [];
  private ubicacionesSubscription!: Subscription;

  constructor(private itemsService: ItemsService, private ubicacionesService: UbicacionesService, private router: Router,private puertoService :PuertoService) { }

  ngOnInit(): void {

    this.idUbicacion = this.obtenerId();
    //this.mostrarItems(this.idUbicacion);
    /*
        this.ubicacionesService.obtenerUbicacionesList();

        this.ubicacionesSubscription = this.ubicacionesService.obtenerActualListener().subscribe((ubicaciones: Ubicacion[]) => {
          this.dataSourcePuertos = new MatTableDataSource<Ubicacion>(ubicaciones);
        });
    */

    this.puertoService.obtenerPuertos(this.puertosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    this.ubicacionesSubscription = this.puertoService.obtenerActualListenerPag().subscribe((pagination: PaginationUbicaciones) => {
      this.dataSourcePuertos = new MatTableDataSource<Ubicacion>(pagination.data);
      this.puertasos = pagination.data;
    });

  }
  ngOnDestroy() {
    this.mostrar = false;
    this.ubicacionesSubscription.unsubscribe();
  }

  mostrarItems(id: string) {
    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response => {
      this.ubicacion = response;
      console.log("nombre: " + this.ubicacion.nombre)
      this.dataSource = this.ubicacion.items;
    }, e => {
      console.log("error: " + e);
    })
  }

  eliminar(id: string) {
    this.itemsService.deleteItem(id).subscribe(eliminado => {
      this.mostrarItems(this.idUbicacion);
    }, error => {
      console.log(error);
    })
  }

  editItem(id: string) {
    this.router.navigate(['registrar?id={{id}}']);
  }
  obtenerId() {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    return urlParams.get('id') + "";
  }
}

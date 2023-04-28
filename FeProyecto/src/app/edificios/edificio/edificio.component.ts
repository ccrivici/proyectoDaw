import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Item } from 'src/app/items/items/item.model';
import { ItemsService } from 'src/app/items/items/items.service';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { EdificioService } from './edificio.service';
import { Subscription } from 'rxjs';
import { PaginationUbicaciones } from 'src/app/ubicaciones/ubicaciones/pagination-ubicaciones.model';
import { PageEvent } from '@angular/material/paginator';
import { PdfComponent } from 'src/app/pdf/pdf.component';

@Component({
  selector: 'app-edificio',
  templateUrl: './edificio.component.html',
  styleUrls: ['./edificio.component.css']
})
export class EdificioComponent {

  idUbicacion!: string;
  ubicacion!: any;
  desplegarColumnasEdificio = ["nombre", "items", "añadir", "añadirMantenimiento","mantenimientos", "ubicacion"];

  dataSource = new MatTableDataSource<Item>();
  private ubicacionesSubscription!: Subscription;
  dataSourceEdificios = new MatTableDataSource<Ubicacion>();
  edificiosData: Ubicacion[] = [];
  //paginacion
  totalEdificios = 0;
  edificiosPorPagina = 2;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'titulo';
  sortDirection = 'asc';
  filterValue = {
    propiedad: "tipo",
    valor: "edificio"
  }
  timeout: any = null;

  constructor(private itemsService: ItemsService, private ubicacionesService: UbicacionesService, private router: Router, private edificioService: EdificioService) { }

  ngOnInit(): void {

    this.idUbicacion = this.obtenerId();
    this.edificioService.obtenerEdificios(this.edificiosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    this.ubicacionesSubscription = this.edificioService.obtenerActualListenerPag().subscribe((pagination: PaginationUbicaciones) => {
      this.dataSourceEdificios = new MatTableDataSource<Ubicacion>(pagination.data);
    });

  }
  ngOnDestroy() {
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
    this.idUbicacion = urlParams.get('id') + "";
    return urlParams.get('id') + "";
  }

  hacerFiltro(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    //esta función se ejectua cuando el usuario deje de escribir por mas de un segundo
    this.timeout = setTimeout(() => {
      if (event.keycode !== 13) {
        const filterValueLocal = {
          propiedad: 'nombre',
          valor: event.target.value
        };
        $this.filterValue = filterValueLocal;

        //aqui obtenemos los libros pasando como filtro la constante creada antes
        $this.edificioService.obtenerEdificios($this.edificiosPorPagina, $this.paginaActual, $this.sort, $this.sortDirection, filterValueLocal);
      }
    }, 1000);
  }
  eventoPaginador(event: PageEvent): void {
    this.edificiosPorPagina = event.pageSize;
    this.paginaActual = event.pageIndex + 1;
    this.edificioService.obtenerEdificios(this.edificiosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
  }

  ordenarColumna(event: any) {
    this.sort = event.active;
    this.sortDirection = event.direction;
    //obtenemos la lista de libros pero con el event.active capturamos la columna que tiene que ser ordenada y la direccion
    this.edificioService.obtenerEdificios(this.edificiosPorPagina, this.paginaActual, event.active, event.direction, this.filterValue);
  }

  generarPdf(ubiId){

  }
}

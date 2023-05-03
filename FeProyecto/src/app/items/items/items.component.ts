import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { Item } from './item.model';
import { ItemsService } from './items.service';
import { Subscription } from 'rxjs';
import { PaginationItems } from './pagination-items.model';
import { PageEvent } from '@angular/material/paginator';


@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy{
  desplegarColumnas = ["denominacion",'ubicacion', 'conjuntoEquipo', 'equipo', 'marcaModelo', 'periocidad', 'categoria','modificar','eliminar'];
  dataSource ;
  idUbicacion!:any;
  ubicacion!:any;
  ubicacionId!: string;
  id!: string;

  //paginacion
  totalItems = 0;
  itemsPorPagina = 5;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'marcaModelo';
  sortDirection = 'asc';
  filterValue = {
    propiedad: "denominacion",
    valor: ""
  }
  private itemsSubscription!:Subscription;


  timeout: any = null;
  constructor(private itemsService: ItemsService,private ubicacionesService:UbicacionesService,private router:Router) {}

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    this.obtenerId();
    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response=>{
      this.ubicacion = response;
      /* if (this.ubicacion != undefined){
        this.dataSource = this.ubicacion.items;
      } */

      this.filterValue= {
        propiedad: "denominacion",
        valor: this.ubicacion.nombre
      }

      this.itemsService.obtenerItemsPag(this.itemsPorPagina,this.paginaActual,this.sort,this.sortDirection,this.filterValue);
      console.log("nombre ubicacion: "+this.ubicacion.nombre + " filter value: "+this.filterValue.valor)
        this.itemsSubscription = this.itemsService.obtenerActualListenerPag().subscribe((pagination:PaginationItems)=>{
          this.dataSource = new MatTableDataSource<Item>(pagination.data);
          this.totalItems = pagination.totalRows

        })


    },e=>{
      console.log("error: "+e);
    })



  }
  eliminar(id:string){
    console.log("eliminar item de la ubicacion "+this.ubicacion.nombre)
    //eliminamos el elemento
    this.itemsService.deleteItem(id).subscribe(() =>{
      this.ubicacionesService.deleteItemFromUbicacion(this.ubicacion,id);
    });
    this.router.navigate(['/items',this.ubicacionId]);
    //actualizamos la lista de items de la ubicacion

  }
  obtenerId(){
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    this.id = urlParams.get('id')+"";
    this.idUbicacion = urlParams.get('Ubicacionid')+"";
  }
//METODOS PARA PAGINACION

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
      $this.itemsService.obtenerItemsPag($this.itemsPorPagina, $this.paginaActual, $this.sort, $this.sortDirection, filterValueLocal);
    }
  }, 1000);
}
eventoPaginador(event: PageEvent): void {
  this.itemsPorPagina = event.pageSize;
  this.paginaActual = event.pageIndex + 1;
  this.itemsService.obtenerItemsPag(this.itemsPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
}

ordenarColumna(event: any) {
  this.sort = event.active;
  this.sortDirection = event.direction;
  //obtenemos la lista de libros pero con el event.active capturamos la columna que tiene que ser ordenada y la direccion
  this.itemsService.obtenerItemsPag(this.itemsPorPagina, this.paginaActual, event.active, event.direction, this.filterValue);
}
}

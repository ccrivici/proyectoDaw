import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { Item } from './item.model';
import { ItemsService } from './items.service';
import { Subscription } from 'rxjs';
import { PaginationItems } from './pagination-items.model';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from 'src/app/dialog/confirm-dialog/confirm-dialog.component';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { CustomPaginator } from 'src/app/paginator';

@Injectable({
  providedIn:'root'
})

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator("Items por página") }
  ]
})
export class ItemsComponent implements OnInit, OnDestroy {
  desplegarColumnas = [
    'denominacion',
    'ubicacion',
    'conjuntoEquipo',
    'equipo',
    'marcaModelo',
    'periocidad',
    'categoria',
    'modificar',
    'eliminar',
  ];
  dataSource;
  idUbicacion!: any;
  ubicacion!: any;
  id!: string;

  //paginacion
  totalItems = 0;
  itemsPorPagina = 5;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'marcaModelo';
  sortDirection = 'asc';
  filterValue = {
    propiedad: 'denominacion',
    valor: '',
  };
  private itemsSubscription!: Subscription;

  timeout: any = null;
  constructor(
    public dialog: MatDialog,
    private itemsService: ItemsService,
    private ubicacionesService: UbicacionesService,
    private router: Router,private rutaActiva: ActivatedRoute
  ) {}

  eliminarRegistro(id: number) {}

  ngOnDestroy(): void {}
  ngOnInit(): void {
    this.obtenerId();
    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(
      (response) => {
        this.ubicacion = response;
        /* if (this.ubicacion != undefined){
        this.dataSource = this.ubicacion.items;
      } */

        this.filterValue = {
          propiedad: 'denominacion',
          valor: this.ubicacion.nombre,
        };

        this.itemsService.obtenerItemsPag(
          this.itemsPorPagina,
          this.paginaActual,
          this.sort,
          this.sortDirection,
          this.filterValue
        );
        console.log(
          'nombre ubicacion: ' +
            this.ubicacion.nombre +
            ' filter value: ' +
            this.filterValue.valor
        );
        this.itemsSubscription = this.itemsService
          .obtenerActualListenerPag()
          .subscribe((pagination: PaginationItems) => {
            pagination.data.filter(item => item.denominacion == response.nombre)
            this.dataSource = new MatTableDataSource<Item>(pagination.data);
            this.totalItems = pagination.totalRows;
          });
      },
      (e) => {
        console.log('error: ' + e);
      }
    );
  }
  eliminar(id: string) {
    console.log('eliminar item de la ubicacion ' + this.ubicacion.nombre);
    //eliminamos el elemento
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        message: '¿Está seguro de que desea eliminar este registro?',
        buttonText: {
          ok: 'Eliminar',
          cancel: 'Cancelar',
        },
      },
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log(`
        id ubi subs: ${this.ubicacion.id}
        id ubi: ${this.idUbicacion}
        item a borrar: ${id}
        `)
      this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe((ubicacion:Ubicacion)=>{
        console.log(`uicacion a modi: ${ubicacion}
        `)
          // Aquí elimina el registro utilizando el ID
          this.itemsService.deleteItem(id).subscribe(() => {
            this.ubicacionesService.deleteItemFromUbicacion(ubicacion, id);
          });

      })
    }

    });

  }
  obtenerId() {
    this.idUbicacion=  this.rutaActiva.snapshot.params['ubicacionId']
    console.log(`id ubicacion: ${this.idUbicacion}`)
  }

  /* obtenerId() {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    this.id = urlParams.get('id') + '';
    this.idUbicacion = urlParams.get('Ubicacionid') + '';
  } */

  //METODOS PARA PAGINACION

  hacerFiltro(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    //esta función se ejectua cuando el usuario deje de escribir por mas de un segundo
    this.timeout = setTimeout(() => {
      this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe((response:Ubicacion) => {

      if (event.keycode !== 13) {
        var filterValueLocal = {
          propiedad: 'marcaModelo',
          valor: event.target.value,
        };
          if (event.target.value === ""){
            console.log("filtro vacio: "+this.idUbicacion)
            filterValueLocal = {
              propiedad: 'denominacion',
              valor: response.nombre
            };
          }
          $this.filterValue = filterValueLocal;

          //aqui obtenemos los libros pasando como filtro la constante creada antes
          $this.itemsService.obtenerItemsPag(
            $this.itemsPorPagina,
            $this.paginaActual,
            $this.sort,
            $this.sortDirection,
            filterValueLocal
          );


      }
    });
    }, 1000);
  }
  eventoPaginador(event: PageEvent): void {
    this.itemsPorPagina = event.pageSize;
    this.paginaActual = event.pageIndex + 1;
    this.itemsService.obtenerItemsPag(
      this.itemsPorPagina,
      this.paginaActual,
      this.sort,
      this.sortDirection,
      this.filterValue
    );
  }

  ordenarColumna(event: any) {
    this.sort = event.active;
    this.sortDirection = event.direction;
    //obtenemos la lista de libros pero con el event.active capturamos la columna que tiene que ser ordenada y la direccion
    this.itemsService.obtenerItemsPag(
      this.itemsPorPagina,
      this.paginaActual,
      event.active,
      event.direction,
      this.filterValue
    );
  }
  goBack() {
    window.history.back();
  }
}

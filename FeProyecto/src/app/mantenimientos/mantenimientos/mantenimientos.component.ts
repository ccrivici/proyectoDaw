import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from './mantenimientos.service';
import { Subscription } from 'rxjs';
import { Mantenimiento } from './mantenimiento.model';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { DateAdapter } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { PaginationMantenimientos } from './pagination-mantenimientos';
import { MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { ConfirmDialogComponent } from 'src/app/dialog/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { CustomPaginator, Utils } from 'src/app/paginator';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css'],
  providers: [
    { provide: MatPaginatorIntl, useValue: CustomPaginator("Mantenimientos por página") }
  ]
})
export class MantenimientosComponent implements OnInit {
  private mantenimientoSubscription!: Subscription
  mantenimientoData: Mantenimiento[] = [];
  desplegarColumnas = ["descripcion","estado","corregido","observaciones","periocidad","fecha","modificar","eliminar"];
  dataSource;

  //paginacion
  totalMantenimientos = 0;
  mantenimientosPorPagina = 4;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'descripcion';
  sortDirection = 'asc';
  filterValue: any = null;
  id!: string;
  idUbicacion!: string;
  ubicacion!: Ubicacion;
  timeout: any = null;
  util: any;

  constructor(private mantenimientoService: MantenimientoService,private ubicacionesService:UbicacionesService,private router:Router,private rutaActiva: ActivatedRoute,
  private readonly adapter: DateAdapter<Date>, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.util = new Utils();

    this.obtenerId();

    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response=>{
      this.util.mostrar2(`Vista de Mantenimientos - ${response.nombre}`);
    this.filterValue= {
      propiedad: "ubicacion_id",
      valor: this.idUbicacion
    }

    this.mantenimientoService.obtenerMantenimientosPag(this.mantenimientosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    this.mantenimientoSubscription = this.mantenimientoService.obtenerActualListener().subscribe((pagination: PaginationMantenimientos) => {
      pagination.data.filter(mantenimiento => mantenimiento.ubicacion_id == response.id)
      this.dataSource = new MatTableDataSource<Mantenimiento>(pagination.data);
      this.totalMantenimientos = pagination.totalRows
    });


    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response=>{
      this.ubicacion = response;
      if (this.ubicacion != undefined){
        this.dataSource = this.ubicacion.mantenimientos;
      }
    },e=>{
      console.log("error: "+e);
    })
  })
}
  parse(date:Date){
    var fecha = new Date(date)
    return fecha.toLocaleDateString("es-ES")
  }
  eliminar(id:string){
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
        this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe((ubicacion:Ubicacion)=>{
          this.mantenimientoService.deleteMantenimiento(id).subscribe(data =>{
            this.ubicacionesService.deleteMantenimientoFromUbicacion(ubicacion,id);
          });
        })

      }

    });
    //actualizamos la lista de items de la ubicacion
  }
  //obtiene el id  y el id de la ubicacion de la url
  obtenerId() {
    this.idUbicacion=  this.rutaActiva.snapshot.params['ubicacionId'];
    this.id = this.rutaActiva.snapshot.params['id'];
  }

  //MÉTODOS PARA PAGINAR

  hacerFiltro(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    //esta función se ejectua cuando el usuario deje de escribir por mas de un segundo
    this.timeout = setTimeout(() => {
      this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe((response:Ubicacion) => {
      if (event.keycode !== 13) {
        var filterValueLocal = {
          propiedad: 'descripcion',
          valor: event.target.value
        };
        if (event.target.value === ""){
          filterValueLocal = {
            propiedad: 'ubicacion_id',
            valor: this.idUbicacion
          };
        }
        $this.filterValue = filterValueLocal;

        //aqui obtenemos los libros pasando como filtro la constante creada antes
        $this.mantenimientoService.obtenerMantenimientosPag($this.mantenimientosPorPagina, $this.paginaActual, $this.sort, $this.sortDirection, filterValueLocal);
      }
    });
    }, 1000);
  }
  eventoPaginador(event: PageEvent): void {
    this.mantenimientosPorPagina = event.pageSize;
    this.paginaActual = event.pageIndex + 1;
    this.mantenimientoService.obtenerMantenimientosPag(this.mantenimientosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
  }

  ordenarColumna(event: any) {
    this.sort = event.active;
    this.sortDirection = event.direction;
    //obtenemos la lista de libros pero con el event.active capturamos la columna que tiene que ser ordenada y la direccion
    this.mantenimientoService.obtenerMantenimientosPag(this.mantenimientosPorPagina, this.paginaActual, event.active, event.direction, this.filterValue);
  }
  goBack() {
    window.history.back();
  }
}

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
import { PageEvent } from '@angular/material/paginator';



@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  private mantenimientoSubscription!: Subscription
  mantenimientoData: Mantenimiento[] = [];
  desplegarColumnas = ["descripcion","estado","corregido","observaciones","periocidad","fecha","imagenes","modificar","eliminar"];
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

  constructor(private mantenimientoService: MantenimientoService,private ubicacionesService:UbicacionesService,private router:Router,private route :ActivatedRoute,
  private readonly adapter: DateAdapter<Date>) {}

  ngOnInit(): void {
    //Pagination

    this.obtenerId();

    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response=>{

    this.filterValue= {
      propiedad: "ubicacion_id",
      valor: this.idUbicacion
    }

    this.mantenimientoService.obtenerMantenimientosPag(this.mantenimientosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    this.mantenimientoSubscription = this.mantenimientoService.obtenerActualListener().subscribe((pagination: PaginationMantenimientos) => {
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
    this.mantenimientoService.deleteMantenimiento(id).subscribe(data =>{
      this.ubicacionesService.deleteMantenimientoFromUbicacion(this.ubicacion,id);
    });
    //actualizamos la lista de items de la ubicacion
  }
  obtenerId(){
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    this.id = urlParams.get('id')+"";
    this.idUbicacion = urlParams.get('Ubicacionid')+"";
  }


  //MÉTODOS PARA PAGINAR

  hacerFiltro(event: any) {
    clearTimeout(this.timeout);
    var $this = this;
    //esta función se ejectua cuando el usuario deje de escribir por mas de un segundo
    this.timeout = setTimeout(() => {
      if (event.keycode !== 13) {
        const filterValueLocal = {
          propiedad: 'descripcion',
          valor: event.target.value
        };
        $this.filterValue = filterValueLocal;

        //aqui obtenemos los libros pasando como filtro la constante creada antes
        $this.mantenimientoService.obtenerMantenimientosPag($this.mantenimientosPorPagina, $this.paginaActual, $this.sort, $this.sortDirection, filterValueLocal);
      }
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
}

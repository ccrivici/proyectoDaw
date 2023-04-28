import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from './mantenimientos.service';
import { Subscription } from 'rxjs';
import { PaginationMantenimientos } from './pagination-mantenimientos';
import { Mantenimiento } from './mantenimiento.model';
import { MatTableDataSource } from '@angular/material/table';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  private mantenimientoSubscription!: Subscription
  mantenimientoData: Mantenimiento[] = [];
  desplegarColumnas = ["descripcion","estado","corregido","observaciones","periocidad","fecha","imagenes","modificar","eliminar"];
  dataSource!: Mantenimiento[];

  //paginacion
  totalMantenimientos = 0;
  mantenimientosPorPagina = 2;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'descripcion';
  sortDirection = 'asc';
  filterValue: any = null;
  id!: string;
  idUbicacion!: string;
  ubicacion!: Ubicacion;


  constructor(private mantenimientoService: MantenimientoService,private ubicacionesService:UbicacionesService,private router:Router,private route :ActivatedRoute) {}

  ngOnInit(): void {
    /* this.mantenimientoService.obtenerMantenimientosPag(this.mantenimientosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    this.mantenimientoSubscription = this.mantenimientoService.obtenerActualListener().subscribe((pagination: PaginationMantenimientos) => {
      this.dataSource = new MatTableDataSource<Mantenimiento>(pagination.data);
      this.totalMantenimientos = pagination.totalRows
    }, error => {
      console.log(error)
    }); */

    this.obtenerId();
    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response=>{
      this.ubicacion = response;
      if (this.ubicacion != undefined){
        this.dataSource = this.ubicacion.mantenimientos;
      }
      console.log("aaa"+this.ubicacion.nombre)
    },e=>{
      console.log("error: "+e);
    })
  }

  eliminar(id:string){
    console.log("eliminar item de la ubicacion "+this.ubicacion.nombre)
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

}

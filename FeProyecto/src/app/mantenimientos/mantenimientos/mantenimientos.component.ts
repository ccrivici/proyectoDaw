import { Component, OnInit } from '@angular/core';
import { MantenimientoService } from './mantenimientos.service';
import { Subscription } from 'rxjs';
import { PaginationMantenimientos } from './pagination-mantenimientos';
import { Mantenimiento } from '../mantenimiento.model';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-mantenimientos',
  templateUrl: './mantenimientos.component.html',
  styleUrls: ['./mantenimientos.component.css']
})
export class MantenimientosComponent implements OnInit {
  private mantenimientoSubscription!: Subscription
  mantenimientoData: Mantenimiento[] = [];
  desplegarColumnas = [""];
  dataSource = new MatTableDataSource<Mantenimiento>();


  //paginacion
  totalMantenimientos = 0;
  mantenimientosPorPagina = 2;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'descripcion';
  sortDirection = 'asc';
  filterValue: any = null;


  constructor(private mantenimientoService: MantenimientoService) { }

  ngOnInit(): void {
    this.mantenimientoService.obtenerMantenimientos(this.mantenimientosPorPagina, this.paginaActual, this.sort, this.sortDirection, this.filterValue);
    this.mantenimientoSubscription = this.mantenimientoService.obtenerActualListener().subscribe((pagination: PaginationMantenimientos) => {
      this.dataSource = new MatTableDataSource<Mantenimiento>(pagination.data);
      this.totalMantenimientos = pagination.totalRows
    }, error => {
      console.log(error)
    });
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from './item.model';
import { Subscription } from 'rxjs';
import { ItemsService } from './items.service';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy{
  desplegarColumnas = ["denominacion",'ubicacion', 'conjuntoEquipo', 'equipo', 'marcaModelo', 'periocidad', 'categoria','modificar','eliminar'];
  dataSource = new MatTableDataSource<Item>();
  private itemsSubscription!: Subscription;
  idUbicacion!:any;
  ubicacion!:any;
  ubicacionId!: string;

  constructor(private itemsService: ItemsService,private ubicacionesService:UbicacionesService) {}

  ngOnDestroy(): void {
    //this.itemsSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.idUbicacion =this.obtenerId();
    console.log("id de la ubicacion: "+this.idUbicacion);
    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response=>{
      this.ubicacion = response;
      if (this.ubicacion != undefined){
        this.dataSource = this.ubicacion.items;
      }
      console.log("aaa"+this.ubicacion.nombre)
      /*console.log("ahora si: "+ this.ubicacion.items[0]);
      for (const iterator of this.ubicacion.items) {
        console.log(iterator);
      }*/
    },e=>{
      console.log("error: "+e);
    })


  }
  eliminar(id:string){
    console.log("eliminar item de la ubicacion "+this.ubicacion.nombre)
    console.log(id)
    this.itemsService.deleteItem(id).subscribe(data =>{

    })
  }
  obtenerId(){
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    return urlParams.get('id')+"";

  }
}

import { Component, Injectable, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from './item.model';
import { Subscription } from 'rxjs';
import { ItemsService } from './items.service';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { ActivatedRoute, Route, Router } from '@angular/router';


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
  dataSource = new MatTableDataSource<Item>();
  idUbicacion!:any;
  ubicacion!:any;
  ubicacionId!: string;
  id!: string;

  constructor(private itemsService: ItemsService,private ubicacionesService:UbicacionesService,private router:Router,private route :ActivatedRoute) {}

  ngOnDestroy(): void {

  }
  ngOnInit(): void {
    var idDef = this.route.snapshot.paramMap.get('UbicacionId');
    console.log(`idDef: ${idDef}`)
    this.obtenerId();
    console.log("id de la ubicacion: "+this.idUbicacion+" id elemento: "+this.id +
    " componente: items component añadir item a ubi");
    this.ubicacionesService.obtenerUbicacion(this.idUbicacion).subscribe(response=>{
      this.ubicacion = response;
      if (this.ubicacion != undefined){
        this.dataSource = this.ubicacion.items;
      }
      console.log("aaa"+this.ubicacion.nombre)
    },e=>{
      console.log("error: "+e);
    })
  }
  eliminar(id:string){
    console.log("eliminar item de la ubicacion "+this.ubicacion.nombre)
    //eliminamos el elemento
    this.itemsService.deleteItem(id).subscribe(data =>{
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
}

import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Ubicacion } from "./ubicacion.model";
import { environment } from "src/environments/environment.development";
import { Subject } from "rxjs";
import { Pagination } from "src/app/pagination.model";
import { PaginationUbicaciones } from "./pagination-ubicaciones.model";
import { Item } from "src/app/items/items/item.model";


@Injectable({
  providedIn:'root'
})
export class UbicacionesService{
  private ubicacionesList: Ubicacion[] = [];
  baseUrl = environment.baseUrl;
  ubicacionSubjectPagination= new Subject<PaginationUbicaciones[]>();
  ubicacionSubject = new Subject<Ubicacion[]>();
  private ubicacionesPagination!: PaginationUbicaciones[];
  constructor(private http:HttpClient){}
  ubicacionSubjectDef = new Subject<Ubicacion>();
 ubicacionFiltrada!:Ubicacion;

  obtenerUbicacionesPag(totalUbicaciones:number, paginaActual:number, sort:string,sortDirection:string,filterValue:any){
    const request = {
      PageSize:totalUbicaciones,
      page:paginaActual,
      sort,
      sortDirection,
      filterValue
    }
    this.http.post<PaginationUbicaciones[]>(this.baseUrl + 'api/ubicacion/pagination',request).subscribe((data) => {
      this.ubicacionesPagination = data;
      this.ubicacionSubjectPagination.next(this.ubicacionesPagination);
    });
  }



  obtenerActualListenerPag(){
    return this.ubicacionSubjectPagination.asObservable();
  }
  //obtener ubicacion por id!!!!
  obtenerUbicacion(id:string){
   return this.http.get<Ubicacion>(this.baseUrl + `api/ubicacion/${id}`);

  }
  obtenerActualListenerDef(){
    return this.ubicacionSubjectDef;
  }
  //update items
  updateUbicacion(id:String, ubicacion:Ubicacion,item:Item,idItem:string){
    //var itemsRes = itemsAct.filter(item=> item.id != idItem);
    var modificado = false;

    ubicacion.items.forEach(element => {
      if (element.id == idItem){
        console.log(`id item: ${element.id} buscando: ${idItem}`)
        element.id = idItem;
        element.denominacion = item.denominacion;
        element.ubicacion = item.ubicacion;
        element.conjuntoEquipo = item.conjuntoEquipo;
        element.equipo = item.equipo;
        element.marcaModelo= item.marcaModelo;
        element.periocidad = item.periocidad;
        element.categoria = item.categoria;
        modificado = true;
      }
    });
    if (modificado == false){
      ubicacion.items.push(item)
    }
    this.http.put<Ubicacion>(this.baseUrl + `api/ubicacion/${id}`,ubicacion).subscribe((data) => {
        console.log(data)
    });
  }
  deleteItemFromUbicacion(ubicacion:Ubicacion,itemId:string){
    var contador = 0;
    ubicacion.items.forEach(element =>{
      if (element.id == itemId){
        ubicacion.items.splice(contador,1);
      }
      contador++;
    })

    this.http.put<Ubicacion>(this.baseUrl + `api/ubicacion/${ubicacion.id}`,ubicacion).subscribe((data) => {
      console.log(data)
  });

  }

  obtenerUbicacionesList(){
    return this.http.get<Ubicacion[]>(this.baseUrl + 'api/ubicacion');
  }

  /*obtenerUbicacionesList(){
    this.http.get<Ubicacion[]>(this.baseUrl + 'api/ubicacion').subscribe((data) => {
      this.ubicacionesList = data;
      this.ubicacionSubject.next([...this.ubicacionesList]);
    });
  }*/
  obtenerActualListener(){
    return this.ubicacionSubject.asObservable();
  }
}

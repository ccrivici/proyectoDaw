import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Item } from "./item.model";
import { Observable, Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn:'root'
})
export class ItemsService{
  baseUrl = environment.baseUrl;

  private itemsLista: Item[] = [];
  private itemsSubject = new Subject<Item[]>();
  private itemSubjectById = new Subject<Item>();
  itemById!:Item;

  constructor(private http: HttpClient) {}

  obtenerItems() {
    this.http.get<Item[]>(this.baseUrl + 'api/item').subscribe((data) => {
      this.itemsLista = data;
      this.itemsSubject.next([...this.itemsLista]);
    });
  }
  obtenerItemById(id:string){
    return this.http.get<Item>(this.baseUrl + `api/item/${id}`);

  }
  obtenerActualListener() {
    return this.itemsSubject.asObservable();
  }
  updateItem(id:string,item: Item):Observable<any>{
    return this.http.put(this.baseUrl+`api/item/${id}`,item);
  }
  guardarItem(item:Item){
    return this.http.post(this.baseUrl+'api/item',item);
      //permite actualizar y devolver la lista de items actualizada al grid de items

      this.itemsSubject.next(this.itemsLista);
      //return response;

  }

  /* guardarItem(item:Item){
    this.http.post(this.baseUrl+'api/item',item).subscribe((response)=>{
      //permite actualizar y devolver la lista de items actualizada al grid de items
      console.log("respuesta: "+response.)
      this.itemsSubject.next(this.itemsLista);
      //return response;
    });
  } */
  guardarLibroListener(){
    return this.itemsSubject.asObservable();
  }
  deleteItem(id: string):Observable<any>{
    return this.http.delete(this.baseUrl+`api/item/${id}`);
  }
}

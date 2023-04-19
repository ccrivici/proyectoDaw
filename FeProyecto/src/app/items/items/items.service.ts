import { Injectable } from "@angular/core";
import { environment } from "src/environments/environment.development";
import { Item } from "./item.model";
import { Subject } from "rxjs";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn:'root'
})
export class ItemsService{
  baseUrl = environment.baseUrl;

  private itemsLista: Item[] = [];
  private itemsSubject = new Subject<Item[]>();


  constructor(private http: HttpClient) {}

  obtenerItems() {
    this.http.get<Item[]>(this.baseUrl + 'api/item').subscribe((data) => {
      this.itemsLista = data;
      this.itemsSubject.next([...this.itemsLista]);
    });
  }
  obtenerActualListener() {
    return this.itemsSubject.asObservable();
  }

  guardarItem(item:Item){
    this.http.post(this.baseUrl+'api/item',item).subscribe((response)=>{
      //permite actualizar y devolver la lista de items actualizada al grid de items
      this.itemsSubject.next(this.itemsLista);
    });
  }
  guardarLibroListener(){
    return this.itemsSubject.asObservable();
  }

}

import { OnInit } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";
import { count } from "rxjs";

export class Utils{
  constructor() {}
  mostrar2(titulo:string){
    const infoActualElement = document.querySelector('.info_actual');
    infoActualElement.textContent = titulo;
  }
}
export function CustomPaginator(texto:string) {
  const customPaginatorIntl = new MatPaginatorIntl();
  customPaginatorIntl.itemsPerPageLabel = texto;

  return customPaginatorIntl;
}


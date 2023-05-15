import { MatPaginatorIntl } from "@angular/material/paginator";


export function CustomPaginator(texto:string) {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = texto;

  return customPaginatorIntl;
}

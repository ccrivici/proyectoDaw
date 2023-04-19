import { Item } from "./item.model";

export interface PaginationItems{

  pageSize: number;
  page:number;
  sort:string;
  sortDirection:string;
  pagesQuantity:number;
  data: Item[];
  filterValue:{};
  totalRows:number;
}

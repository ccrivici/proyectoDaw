import { Item } from "src/app/items/items/item.model";
import { Mantenimiento } from "src/app/mantenimientos/mantenimiento.model";

export interface Ubicacion{
  id:string;
  nombre:string;
  tipo:string;
  items: Item[];
  mantenimientos: Mantenimiento[];
}

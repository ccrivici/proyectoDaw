export interface Mantenimiento{
  id:string;
  descripcion:string;
  estado:string;
  corregido:boolean;
  observaciones:string;
  imagenes: string[];
  periocidad: string;
  fecha?: Date | undefined;
  item_id:string;
  ubicacion_id:string;
}

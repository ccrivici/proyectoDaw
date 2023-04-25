export interface Mantenimiento{
  id:string;
  descripcion:string;
  estado:string;
  corregido:boolean;
  observaciones:string;
  imagenes: string[];
  fecha?: Date;
  ubicacion_id:string;
}

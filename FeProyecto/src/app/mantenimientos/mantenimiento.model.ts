export interface Mantenimiento{
  descripcion:string;
  estado:string;
  corregido:boolean;
  observaciones:string;
  periocidad:string;
  imagenes: string[];
  fecha?: Date;
}

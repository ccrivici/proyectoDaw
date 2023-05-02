import { Component, OnDestroy, OnInit } from '@angular/core';
import { MantenimientoService } from '../mantenimientos/mantenimientos.service';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { Mantenimiento } from '../mantenimientos/mantenimiento.model';
import { Item } from 'src/app/items/items/item.model';
import { ItemsService } from 'src/app/items/items/items.service';


import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';





@Component({
  selector: 'app-registrar-mantenimiento',
  templateUrl: './registrar-mantenimiento.component.html',
  styleUrls: ['./registrar-mantenimiento.component.css'],

})
export class RegistrarMantenimientoComponent implements OnInit, OnDestroy {
  selectItem!: Item;
  selectCorregido!: string;

  selected = "true"
  selectedItem:any ='';


  ubicacion!: Ubicacion;
  id!: string;
  ubicacionId!: string;
  mantenimientoGuardado!: Mantenimiento;
  accion!: string;
  mantenimientoForm: any;
  items: Item[] = [];
  mantenimientoDef: any;
  itemDef!: Item
//controlar si esta elegido el itme

item!:Item;
//borrar?
mantPrueba!:Mantenimiento;
corregido:string |undefined = undefined;

  constructor(private mantenimientoService: MantenimientoService, private ubicacionesService: UbicacionesService, private fb: FormBuilder, private router: Router, private itemsService:ItemsService) {
    this.mantenimientoForm = this.fb.group({
      elementos: ['', Validators.required],
      periocidad: ['', Validators.required],
      fechaMantenimiento: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required],
      corregido: ['', Validators.required],
      fecha: ['', Validators.required],
      observaciones: ['', Validators.required],
      // imagenes:['',Validators.required],
    })
  }
  registrarEditarMantenimiento() {
    if (this.mantenimientoGuardado == undefined) {
      console.log("AÑADIENDO MANTENIMIENTO")
      const MANTENIMIENTO: Mantenimiento = {
        id: "",
        descripcion: this.mantenimientoForm.get('descripcion')?.value,
        estado: this.mantenimientoForm.get('estado')?.value,
        corregido: this.mantenimientoForm.get('corregido')?.value,
        observaciones: this.mantenimientoForm.get('observaciones')?.value,
        imagenes: [""],
        periocidad:this.mantenimientoForm.get('periocidad')?.value,
        fecha: this.mantenimientoForm.get('fecha')?.value,
        item_id: this.mantenimientoForm.get('elementos')?.value,
        ubicacion_id: this.ubicacionId
      }

      this.selectCorregido == "true" ? MANTENIMIENTO.corregido = true : MANTENIMIENTO.corregido = false;
      console.log("ide del item mantenido: " + MANTENIMIENTO.item_id)
      console.log("fecha: "+ MANTENIMIENTO.fecha)

      //OBTENER ITEM DEL MANTENIMIENTO para asignarle la periocidad
      this.itemsService.obtenerItemById(MANTENIMIENTO.item_id).subscribe(item =>{
        console.log("periocidad: "+item.periocidad)
        this.itemDef = item;
      })

      //MANTENIMIENTO.periocidad = this.itemDef.periocidad;

      //AÑADIR MANTENIMIENTO
      this.mantenimientoService.guardarMantenimiento(MANTENIMIENTO).subscribe((dato: any) => {
        console.log(`
        select item: ${dato.id}
        descripcion ${dato.descripcion}
        `)
        this.mantenimientoDef = dato;
        console.log(`id del mantenimiento ${dato.id}
          descr del mantenimiento: ${dato.descripcion}
        `)
        MANTENIMIENTO.id = dato.id;
        //AÑADIR PERIOCIDAD
        this.mantenimientoDef.periocidad = this.itemDef.periocidad;

        this.mantenimientoService.updateMantenimiento(MANTENIMIENTO.id,this.mantenimientoDef).subscribe(dato=>{

        })

        this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe((ubicacion: Ubicacion) => {
          this.ubicacion = ubicacion;
          console.log(`ubicacion nombre:  ${ubicacion.nombre}
          ubicacion id:  ${ubicacion.id}
          `)
          this.ubicacionesService.updateMantenimiento(this.ubicacionId, ubicacion, this.mantenimientoDef, MANTENIMIENTO.id)
        });
        console.log("id ubicacion a añadir: " + this.ubicacionId + " mantenimiento a añadir: " + MANTENIMIENTO.id)


      });

      console.log("añadido")
    } else {
      //modificamos item

      const MANTENIMIENTO: Mantenimiento = {
        id: this.id,
        descripcion: this.mantenimientoForm.get('descripcion')?.value,
        estado: this.mantenimientoForm.get('estado')?.value,
        corregido: this.mantenimientoForm.get('corregido')?.value,
        observaciones: this.mantenimientoForm.get('observaciones')?.value,
        imagenes: [""],
        periocidad: this.mantenimientoForm.get('periocidad')?.value,
        fecha: this.mantenimientoForm.get('fecha')?.value,
        item_id: this.mantenimientoForm.get('elementos')?.value,
        ubicacion_id: this.ubicacionId
      }
      //borrar
     console.log("fechaaa : "+typeof(MANTENIMIENTO.fecha))

     var options = {year:'numeric',month:'long',day:'numeric'};
      var stringDate = MANTENIMIENTO.fecha.toString();
     console.log("fecha string: "+stringDate);
     var fechaDef="";
     for (let i = 0; i < stringDate.length; i++) {
      if (stringDate.charAt(i) != 'T'){
          fechaDef +=stringDate.charAt(i);
      }else{
        break;
      }

     }
      //end

      this.selectCorregido == "true" ? MANTENIMIENTO.corregido = true : MANTENIMIENTO.corregido = false;

      this.mantenimientoService.updateMantenimiento(this.id, MANTENIMIENTO).subscribe(data => {
        console.log("actualizadoaaaa");
      });

      this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe((ubicacion: Ubicacion) => {
        this.ubicacion = ubicacion;
        console.log(`ubicacion nombre:  ${ubicacion.nombre}
          ubicacion id:  ${ubicacion.id}
          `)
        this.ubicacionesService.updateMantenimiento(this.ubicacionId, ubicacion, MANTENIMIENTO, MANTENIMIENTO.id)
      });
      console.log("id ubicacion a modificar: " + this.ubicacionId + " nombre mantenimiento a modificar: " +MANTENIMIENTO.item_id+ "id item a modificar "+MANTENIMIENTO.id )
      console.log("actualizado bien")
    }
  }

  onSelected(item:Item){
    console.log("item: "+item.id)
    this.selectItem = item;
    this.mantenimientoForm.patchValue({
      periocidad: item.periocidad,
    })
  }


  ngOnInit(): void {

    this.obtenerId();
    this.obtenerUbicacionId();
    //aqui
    this.mantenimientoForm.get('corregido').setValue("true")
    console.log(`DATOS INICIALES:
    id mantenimiento: ${this.id}
    id ubicacion: ${this.ubicacionId}`)
    if (this.id != "null" && this.ubicacionId != "null") {
      console.log("ES EDITAR INIT")
      this.esEditar();
    } else if (this.ubicacionId != "null" && this.id == "null") {
      console.log("ESTAMOS AÑADIENDO UN MANTENIMIENTO SIN ID PERO CON UBICACION")
      this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe(ubicacion => {
        this.items = ubicacion.items;
        /*  this.mantenimientoForm.patchValue({
           denominacion: ubicacion.nombre,
         }) */
      });
    }
    else {
      console.log("AÑADIMOS DE 0 UN ITEM")
      /* this.ubicacionesService.obtenerUbicacionesList().subscribe((datos: Ubicacion[]) => {
        this.ubicaciones = datos;
      })*/
    }
  }
  ngOnDestroy(): void {

  }

  esEditar() {
    console.log("id a editar de: " + this.id)
    this.accion = "Editar";
    this.mantenimientoService.obtenerMantenimientoById(this.id).subscribe((dato: Mantenimiento) => {
      this.mantenimientoGuardado = dato;
      console.log(`id: ${this.mantenimientoGuardado.id}
      descripcion: ${this.mantenimientoGuardado.descripcion}
      estado: ${this.mantenimientoGuardado.estado}
      observaciones: ${this.mantenimientoGuardado.observaciones}
        `);
        //comprobamso si el item a mantener está coregido o no y lo asignamos al formulario
        (this.mantenimientoGuardado.corregido == true)? this.corregido= "true" : this.corregido= "false" ;
        console.log("estado de correccion: "+this.mantenimientoGuardado.corregido+ " corregido: "+this.corregido)

      this.itemsService.obtenerItemById(this.mantenimientoGuardado.item_id).subscribe(item => {
        console.log("item del item a modificar manetnimiento  "+item.id)
        this.itemDef = item;
        this.items[0] = item;
        this.mantenimientoForm.patchValue({
          elementos: item.id,
          periocidad: item.periocidad,
          descripcion: this.mantenimientoGuardado.descripcion,
          estado: this.mantenimientoGuardado.estado,
          corregido: this.corregido,
          fecha: this.mantenimientoGuardado.fecha,
          observaciones: this.mantenimientoGuardado.observaciones,
        })
      });
    });
  }

















  obtenerUbicacion(id: string) {
    this.ubicacionesService.obtenerUbicacion(id).subscribe((ubicacion: Ubicacion) => {
      this.ubicacion = ubicacion;
    });
  }

  obtenerId() {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    this.id = urlParams.get('id') + "";
  }
  //obtiene el id de la ubicacion
  obtenerUbicacionId() {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    this.ubicacionId = urlParams.get('Ubicacionid') + "";
  }

  /*  eliminarMantenimiento(id: string) {
     this.mantenimientoService.deleteMantenimiento(id).subscribe(data => {
       this.mantenimientoService.obtenerMantenimientos();
     });
   }  */




}

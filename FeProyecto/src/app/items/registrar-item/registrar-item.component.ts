import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ItemsService } from '../items/items.service';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { MatOption } from '@angular/material/core';
import { MatSelectChange } from '@angular/material/select';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { Subscription } from 'rxjs';
import { PaginationUbicaciones } from 'src/app/ubicaciones/ubicaciones/pagination-ubicaciones.model';
import { Item } from '../items/item.model';
import { Route, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-item',
  templateUrl: './registrar-item.component.html',
  styleUrls: ['./registrar-item.component.css']
})
export class RegistrarItemComponent implements OnInit, OnDestroy {
  //atributos para recoger datos del select del formulario
  selectconjuntoEquipo!: string;
  selectEquipo!: string;
  selectDenominacion!: Ubicacion;
  selectPeriocidad!: string;
  selectCategoria!: string;

  ubicacionAñadir!: Ubicacion;
  //ubicacionesPaginadas:PaginationUbicaciones[] = [];
  ubicaciones: Ubicacion[] = [];
  //borrar?
  itemsList: Item[] = [];
  editar = false;
  mostrar = false;

  //end borrar
  ubicacionSubscription!: Subscription;
  //ubicacionSubscriptionPag!:Subscription;
  //atributos para paginar
  totalUbicaciones = 0;
  ubicacionesPorPagina = 2;
  paginaCombo = [1, 2, 5, 10];
  paginaActual = 1;
  sort = 'nombre';
  sortDirection = 'asc';
  filterValue: any = null;
  //atributos añadir/editar
  item: Item | undefined;
  id!: string;
  ubicacionId!:string;
  //borrar
  ubicacionNombre!:string;
  accion = "Añadir";
  itemForm: FormGroup;
  itemGuardado!: Item|any;
  itemSubscription!: Subscription;
  selectorItem!: string;
  //id para actualizar lista de items en ubicacion
  idActualizar!:string;

  constructor(private itemService: ItemsService, private ubicacionesService: UbicacionesService, private fb: FormBuilder,private router:Router) {
    this.itemForm = this.fb.group({
      denominacion: ['', Validators.required],
      ubicacion: ['', Validators.required],
      conjuntoEquipo: ['', Validators.required],
      equipo: ['', Validators.required],
      marcaModelo: ['', Validators.required],
      periocidad: ['', Validators.required],
      categoria: ['', Validators.required],
    })
  }
  registrarEditarItems() {
    if (this.item == undefined) {
      const item: Item = {
        id:"",
        denominacion:this.itemForm.get('denominacion')?.value,
        ubicacion:this.itemForm.get('ubicacion')?.value,
        conjuntoEquipo:this.itemForm.get('conjuntoEquipo')?.value,
        equipo:this.itemForm.get('equipo')?.value,
        marcaModelo:this.itemForm.get('marcaModelo')?.value,
        periocidad:this.itemForm.get('periocidad')?.value,
        categoria:this.itemForm.get('categoria')?.value,
      }
      //AÑADIR ITEM
      this.itemService.guardarItem(item).subscribe((dato:any)=>{
        this.ubicacionId = this.selectDenominacion.id;
        this.ubicacionNombre = this.selectDenominacion.nombre;
        this.idActualizar = dato.id;
        console.log("id item a actualizar: "+this.idActualizar)
        console.log("id ubicacion a añadir: "+this.ubicacionId+ "nombre ubi: "+this.ubicacionNombre)
      });

      console.log("añadido")
    }else{
      //modificamos item

      const item :Item = {
        id : this.id,
        denominacion:this.itemForm.get('denominacion')?.value,
        ubicacion:this.itemForm.get('ubicacion')?.value,
        conjuntoEquipo:this.itemForm.get('conjuntoEquipo')?.value,
        equipo:this.itemForm.get('equipo')?.value,
        marcaModelo:this.itemForm.get('marcaModelo')?.value,
        periocidad:this.itemForm.get('periocidad')?.value,
        categoria:this.itemForm.get('categoria')?.value
      }
      this.itemService.updateItem(this.id,item).subscribe(data=>{
        console.log("actualizado");
        this.router.navigate(['/']);
      });
    }
  }
  obtenerUbicacion(id:string){

  }
  ngOnInit(): void {
    this.id = this.obtenerId();
    this.ubicacionId = this.obtenerUbicacionId();
    if (this.id != "null"){
      this.esEditar();
    }else if (this.ubicacionId != "null"){
      this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe(ubicacion =>{
        this.ubicaciones[0] = ubicacion;
        this.itemForm.patchValue({
          denominacion: ubicacion.nombre,
        })
    });}
    else{
      this.ubicacionesService.obtenerUbicacionesList().subscribe((datos: Ubicacion[])=>{
        this.ubicaciones = datos;
      })
    }
  }

  esEditar() {
    if (this.id != "null") {
      console.log("id a editar dd: " + this.id)
      this.editar = true;
      this.accion = "Editar";
      this.itemService.obtenerItemById(this.id).subscribe((dato:Item) => {
        this.itemGuardado = dato;
        console.log(`id: ${dato.id}
        denom: ${this.itemGuardado.denominacion}
        ubicacion: ${this.itemGuardado.ubicacion}
        conjuntoEquipo: ${dato.conjuntoEquipo}
        `);
        this.itemForm.patchValue({
          denominacion: this.itemGuardado.denominacion,
          ubicacion: this.itemGuardado.ubicacion,
          conjuntoEquipo: dato.conjuntoEquipo,
          equipo: dato.equipo,
          marcaModelo: "marcaaa",
          periocidad: dato.periocidad,
          categoria: dato.categoria,
        })
      });
    }
  }
  public compareWith(object1: Ubicacion, object2: Ubicacion): boolean {
    return object1 && object2 && object1.id === object2.id;
  }
  eliminarItem(id:string){
      this.itemService.deleteItem(id).subscribe(data =>{
        this.itemService.obtenerItems();
      });
  }
  ngOnDestroy(): void {
    if ( this.ubicacionSubscription != undefined){

      this.ubicacionSubscription.unsubscribe();
    }
  }

  //obtiene el id de la url
  obtenerId() {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);

    return urlParams.get('id') + "";
  }
  obtenerUbicacionId() {
    const valores = window.location.search;
    const urlParams = new URLSearchParams(valores);
    this.id=urlParams.get('id') + "";
    return urlParams.get('Ubicacionid') + "";

  }
}

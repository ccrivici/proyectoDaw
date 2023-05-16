import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemsService } from '../items/items.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { Subscription } from 'rxjs';
import { Item } from '../items/item.model';
import { ActivatedRoute, Router } from '@angular/router';
import { Utils } from 'src/app/paginator';

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


  //ubicacionesPaginadas:PaginationUbicaciones[] = [];
  ubicaciones: Ubicacion[] = [];
  //borrar?
  itemsList: Item[] = [];
  editar = false;
  mostrar = false;
  ubicacion!: Ubicacion
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
  ubicacionId!: string;
  ubicacionNombre!: string;
  accion = "Añadir";
  itemForm: FormGroup;
  itemGuardado!: Item | any;

  itemDef!: Item;
  util: any;

  constructor(private itemService: ItemsService, private ubicacionesService: UbicacionesService, private fb: FormBuilder,private router :Router,private rutaActiva: ActivatedRoute) {
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
    if (this.itemGuardado == undefined) {
      console.log("AÑADIENDO ITEM")
      const item: Item = {
        id: "",
        denominacion: this.itemForm.get('denominacion')?.value,
        ubicacion: this.itemForm.get('ubicacion')?.value,
        conjuntoEquipo: this.itemForm.get('conjuntoEquipo')?.value,
        equipo: this.itemForm.get('equipo')?.value,
        marcaModelo: this.itemForm.get('marcaModelo')?.value,
        periocidad: this.itemForm.get('periocidad')?.value,
        categoria: this.itemForm.get('categoria')?.value,
      }
      //AÑADIR ITEM
      this.itemService.guardarItem(item).subscribe((dato: any) => {
        this.itemDef = dato;
        item.id = dato.id;

        this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe((ubicacion: Ubicacion) => {
          this.ubicacion = ubicacion;
          this.ubicacionesService.updateUbicacion(this.ubicacionId, ubicacion, this.itemDef, item.id)
        });
      });
      this.router.navigate(['/items', this.ubicacionId]);

    } else {
      //modificamos item

      const item: Item = {
        id: this.id,
        denominacion: this.itemForm.get('denominacion')?.value,
        ubicacion: this.itemForm.get('ubicacion')?.value,
        conjuntoEquipo: this.itemForm.get('conjuntoEquipo')?.value,
        equipo: this.itemForm.get('equipo')?.value,
        marcaModelo: this.itemForm.get('marcaModelo')?.value,
        periocidad: this.itemForm.get('periocidad')?.value,
        categoria: this.itemForm.get('categoria')?.value
      }
      this.itemService.updateItem(this.id, item).subscribe(() => {
        console.log("actualizadoaaaa");
      });

      this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe((ubicacion: Ubicacion) => {
          this.ubicacion = ubicacion;
          console.log(`ubicacion nombre:  ${ubicacion.nombre}
          ubicacion id:  ${ubicacion.id}
          `)
          this.ubicacionesService.updateUbicacion(this.ubicacionId, ubicacion, item,item.id)
        });
        console.log("id ubicacion a añadir: " + this.ubicacionId + " nombre ubi: " + this.ubicacionNombre + " item a añadir: " + item.id)
        console.log("actualizado bien")
        //redirigir

      }
      this.router.navigate(['/items', this.ubicacionId]);
  }
  obtenerUbicacion(id: string) {
    this.ubicacionesService.obtenerUbicacion(id).subscribe((ubicacion: Ubicacion) => {
      this.ubicacion = ubicacion;
    });
  }
  ngOnInit(): void {
    this.util = new Utils();

    this.obtenerId();
    console.log(`DATOS INICIALES:
    id elemento: ${this.id}
    id ubicacion: ${this.ubicacionId}`)
    if (this.id != undefined && this.ubicacionId != undefined) {

      console.log("editmaos")
      this.esEditar();
    } else if (this.ubicacionId != undefined && this.id == undefined) {
      console.log("añadimos")
      this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe(ubicacion => {
        this.util.mostrar2(`Añadir Ítem - ${ubicacion.nombre}`);
        this.ubicaciones[0] = ubicacion;
        this.itemForm.patchValue({
          denominacion: ubicacion.nombre,
        })
      });
    }
    else {
      console.log("AÑADIMOS DE 0 UN ITEM")
      this.ubicacionesService.obtenerUbicacionesList().subscribe((datos: Ubicacion[]) => {
        this.ubicaciones = datos;
      })
    }
  }

  esEditar() {
    if (this.id !== "null"){
      this.accion = "Editar";
      this.itemService.obtenerItemById(this.id).subscribe((dato: Item) => {
        this.itemGuardado = dato;
        this.ubicacionesService.obtenerUbicacion(this.ubicacionId).subscribe(ubicacion => {
          this.util.mostrar2(`Editar Ítem - ${ubicacion.nombre}`);
          this.ubicaciones[0] = ubicacion;
          this.itemForm.patchValue({
            denominacion: ubicacion.nombre,
            ubicacion: this.itemGuardado.ubicacion,
            conjuntoEquipo: this.itemGuardado.conjuntoEquipo,
            equipo: this.itemGuardado.equipo,
            periocidad: this.itemGuardado.periocidad,
            categoria: this.itemGuardado.categoria,
            marcaModelo: this.itemGuardado.marcaModelo
          })
        });
      });
    }
  }
  public compareWith(object1: Ubicacion, object2: Ubicacion): boolean {
    return object1 && object2 && object1.id === object2.id;
  }
  eliminarItem(id: string) {
    this.itemService.deleteItem(id).subscribe(() => {
      this.itemService.obtenerItems();
    });
  }
  ngOnDestroy(): void {
  }
  //obtiene el id  y el id de la ubicacion de la url
  obtenerId() {
    this.ubicacionId=  this.rutaActiva.snapshot.params['ubicacionId'];
    console.log(`id ubicacion: ${this.ubicacionId}`);
    this.id = this.rutaActiva.snapshot.params['id'];
  }
}

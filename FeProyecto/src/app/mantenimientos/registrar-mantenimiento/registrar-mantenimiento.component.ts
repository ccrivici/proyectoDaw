import { Component, OnDestroy, OnInit } from '@angular/core';
import { MantenimientoService } from '../mantenimientos/mantenimientos.service';
import { FormBuilder, Validators } from '@angular/forms';
import { UbicacionesService } from 'src/app/ubicaciones/ubicaciones/ubicaciones.service';
import { Ubicacion } from 'src/app/ubicaciones/ubicaciones/ubicacion.model';
import { Mantenimiento } from '../mantenimientos/mantenimiento.model';
import { Item } from 'src/app/items/items/item.model';
import { ItemsService } from 'src/app/items/items/items.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-registrar-mantenimiento',
  templateUrl: './registrar-mantenimiento.component.html',
  styleUrls: ['./registrar-mantenimiento.component.css'],
})
export class RegistrarMantenimientoComponent implements OnInit, OnDestroy {
  selectItem!: Item;
  selectCorregido!: string;

  selected = 'true';

  ubicacion!: Ubicacion;
  id!: string;
  ubicacionId!: string;
  mantenimientoGuardado!: Mantenimiento;
  accion!: string;
  mantenimientoForm: any;
  items: Item[] = [];
  mantenimientoDef: any;
  itemDef!: Item;

  //controlar si esta elegido el item

  corregido: string | undefined = undefined;
  item!: Item;
  //borrar?

  constructor(
    private mantenimientoService: MantenimientoService,
    private ubicacionesService: UbicacionesService,
    private fb: FormBuilder,
    private itemsService: ItemsService,private rutaActiva: ActivatedRoute,private router: Router
  ) {
    this.mantenimientoForm = this.fb.group({
      elementos: ['', Validators.required],
      descripcion: ['', Validators.required],
      estado: ['', Validators.required],
      corregido: ['', Validators.required],
      fechaMantenimiento: ['', Validators.required],
      observaciones: ['', Validators.required],
      // imagenes:['',Validators.required],
    });
  }

  goBack() {
    window.history.back();
  }

  registrarEditarMantenimiento() {
    if (this.mantenimientoGuardado == undefined) {
      console.log('AÑADIENDO MANTENIMIENTO');
      const MANTENIMIENTO: Mantenimiento = {
        id: '',
        descripcion: this.mantenimientoForm.get('descripcion')?.value,
        estado: this.mantenimientoForm.get('estado')?.value,
        corregido: this.mantenimientoForm.get('corregido')?.value,
        observaciones: this.mantenimientoForm.get('observaciones')?.value,
        imagenes: [''],
        periocidad: '',
        fecha: this.mantenimientoForm.get('fecha')?.value,
        item_id: this.mantenimientoForm.get('elementos')?.value,
        ubicacion_id: this.ubicacionId,
      };

      this.selectCorregido == 'true'
        ? (MANTENIMIENTO.corregido = true)
        : (MANTENIMIENTO.corregido = false);

      //OBTENER ITEM DEL MANTENIMIENTO para asignarle la periocidad
      this.itemsService
        .obtenerItemById(MANTENIMIENTO.item_id)
        .subscribe((item) => {
          this.itemDef = item;
        });

      //MANTENIMIENTO.periocidad = this.itemDef.periocidad;

      //AÑADIR MANTENIMIENTO
      this.mantenimientoService
        .guardarMantenimiento(MANTENIMIENTO)
        .subscribe((dato: any) => {
          this.mantenimientoDef = dato;
          MANTENIMIENTO.id = dato.id;
          //AÑADIR PERIOCIDAD
          this.mantenimientoDef.periocidad = this.itemDef.periocidad;

          this.mantenimientoService
            .updateMantenimiento(MANTENIMIENTO.id, this.mantenimientoDef)
            .subscribe(() => {});

          this.ubicacionesService
            .obtenerUbicacion(this.ubicacionId)
            .subscribe((ubicacion: Ubicacion) => {
              this.ubicacion = ubicacion;
              this.ubicacionesService.updateMantenimiento(
                this.ubicacionId,
                ubicacion,
                this.mantenimientoDef,
                MANTENIMIENTO.id
              );
            });
        });
        this.router.navigate(['/mantenimientos', this.ubicacionId]);
    } else {
      //modificamos item

      const MANTENIMIENTO: Mantenimiento = {
        id: this.id,
        descripcion: this.mantenimientoForm.get('descripcion')?.value,
        estado: this.mantenimientoForm.get('estado')?.value,
        corregido: this.mantenimientoForm.get('corregido')?.value,
        observaciones: this.mantenimientoForm.get('observaciones')?.value,
        imagenes: [''],
        periocidad: "",
        fecha: this.mantenimientoForm.get('fechaMantenimiento')?.value,
        item_id: this.mantenimientoForm.get('elementos')?.value,
        ubicacion_id: this.ubicacionId,
      };

      this.selectCorregido == 'true'? (MANTENIMIENTO.corregido = true): (MANTENIMIENTO.corregido = false);

      this.mantenimientoService.updateMantenimiento(this.id, MANTENIMIENTO).subscribe(() => {});

      this.ubicacionesService
        .obtenerUbicacion(this.ubicacionId)
        .subscribe((ubicacion: Ubicacion) => {
          this.ubicacion = ubicacion;
          this.ubicacionesService.updateMantenimiento(
            this.ubicacionId,
            ubicacion,
            MANTENIMIENTO,
            MANTENIMIENTO.id
          );
        });
    }
    this.router.navigate(['/mantenimientos', this.ubicacionId]);
  }



  onSelected(item: Item) {
    this.selectItem = item;
    this.mantenimientoForm.patchValue({
      periocidad: item.periocidad,
    });
  }

  ngOnInit(): void {
    this.obtenerId();
    this.obtenerUbicacionId();
    //aqui
    this.mantenimientoForm.get('corregido').setValue('true');

    if (this.id != undefined && this.ubicacionId != undefined) {
      this.esEditar();
    } else if (this.ubicacionId != undefined && this.id == undefined) {
      this.ubicacionesService
        .obtenerUbicacion(this.ubicacionId)
        .subscribe((ubicacion) => {
          this.items = ubicacion.items;
        });
    }
  }
  ngOnDestroy(): void {}

  esEditar() {
    this.accion = 'Editar';
    this.mantenimientoService
      .obtenerMantenimientoById(this.id)
      .subscribe((dato: Mantenimiento) => {
        this.mantenimientoGuardado = dato;
        //comprobamos si el item a mantener está coregido o no y lo asignamos al formulario
        this.mantenimientoGuardado.corregido == true? (this.corregido = 'true'): (this.corregido = 'false');

        this.itemsService.obtenerItemById(this.mantenimientoGuardado.item_id).subscribe((item) => {
            this.itemDef = item;
            this.items[0] = item;
            this.mantenimientoForm.patchValue({
              elementos: item.id,
              /* periocidad: item.periocidad, */
              descripcion: this.mantenimientoGuardado.descripcion,
              estado: this.mantenimientoGuardado.estado,
              corregido: this.corregido,
              fecha: this.mantenimientoGuardado.fecha,
              observaciones: this.mantenimientoGuardado.observaciones,
            });
          });
      });
  }

  obtenerUbicacion(id: string) {
    this.ubicacionesService
      .obtenerUbicacion(id)
      .subscribe((ubicacion: Ubicacion) => {
        this.ubicacion = ubicacion;
      });
  }
   //obtiene el id
   obtenerId() {
    this.id = this.rutaActiva.snapshot.params['id'];
    console.log(`id item: ${this.id}`);
  }
   //obtiene el id de la ubicacion de la url
   obtenerUbicacionId() {
    this.ubicacionId=  this.rutaActiva.snapshot.params['ubicacionId'];
    console.log(`id ubicacion: ${this.ubicacionId}`);
  }
}

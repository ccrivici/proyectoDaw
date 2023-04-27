import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { BarraComponent } from './navegacion/barra/barra.component';
import {  HttpClientModule } from '@angular/common/http';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ItemsComponent } from './items/items/items.component';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { RegistrarItemComponent } from './items/registrar-item/registrar-item.component';
import { UbicacionesComponent } from './ubicaciones/ubicaciones/ubicaciones.component';
import { MantenimientosComponent } from './mantenimientos/mantenimientos/mantenimientos.component';
import { PuertoComponent } from './puertos/puerto/puerto.component';
import { EdificioComponent } from './edificios/edificio/edificio.component';
import { GenerarUbicacionComponent } from './ubicaciones/generar-ubicacion/generar-ubicacion.component';
import { UbicacionesService } from './ubicaciones/ubicaciones/ubicaciones.service';
import { PuertoService } from './puertos/puerto/puerto.service';
import { RegistrarComponent } from './seguridad/registrar/registrar.component';
import { LoginComponent } from './seguridad/login/login.component';
import { RegistrarMantenimientoComponent } from './mantenimientos/registrar-mantenimiento/registrar-mantenimiento.component';
import { MenuListaComponent } from './navegacion/barra/menu-lista/menu-lista.component';
import { SeguridadService } from './seguridad/seguridad.service';

@NgModule({
  declarations: [
    AppComponent,
    BarraComponent,
    ItemsComponent,
    RegistrarItemComponent,
    UbicacionesComponent,
    MantenimientosComponent,
    PuertoComponent,
    EdificioComponent,
    GenerarUbicacionComponent,
    RegistrarComponent,
    LoginComponent,
    MenuListaComponent,
    RegistrarMantenimientoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    HttpClientModule,
    FormsModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule
  ],
  providers: [UbicacionesService,PuertoService,SeguridadService],
  bootstrap: [AppComponent]
})
export class AppModule { }

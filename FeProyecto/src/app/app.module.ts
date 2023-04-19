import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

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
import { FormsModule } from '@angular/forms';
import { RegistrarItemComponent } from './items/registrar-item/registrar-item.component';
import { UbicacionesComponent } from './ubicaciones/ubicaciones/ubicaciones.component';
import { MantenimientosComponent } from './mantenimientos/mantenimientos/mantenimientos.component';
/*
continuar formulario registar item y añadir Ubicacion

*/
@NgModule({
  declarations: [
    AppComponent,
    BarraComponent,
    ItemsComponent,
    RegistrarItemComponent,
    UbicacionesComponent,
    MantenimientosComponent
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
    MatFormFieldModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

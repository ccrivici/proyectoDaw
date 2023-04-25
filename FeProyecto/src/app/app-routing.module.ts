import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items/items.component';
import { RegistrarItemComponent } from './items/registrar-item/registrar-item.component';
import { PuertoComponent } from './puertos/puerto/puerto.component';
import { EdificioComponent } from './edificios/edificio/edificio.component';
import { UbicacionesComponent } from './ubicaciones/ubicaciones/ubicaciones.component';
import { GenerarUbicacionComponent } from './ubicaciones/generar-ubicacion/generar-ubicacion.component';

const routes: Routes = [
  { path: 'items', component: ItemsComponent },
  { path: 'registrar', component: RegistrarItemComponent },
  { path: 'ubicaciones', component: UbicacionesComponent },
  { path: 'edificios', component: EdificioComponent },
  { path: 'puertos', component: PuertoComponent },
  { path: 'añadirUbicacion', component: GenerarUbicacionComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

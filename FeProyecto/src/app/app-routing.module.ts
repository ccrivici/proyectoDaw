import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ItemsComponent } from './items/items/items.component';
import { RegistrarItemComponent } from './items/registrar-item/registrar-item.component';

const routes: Routes = [
  { path: 'items', component: ItemsComponent },
  { path: 'registrar', component: RegistrarItemComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

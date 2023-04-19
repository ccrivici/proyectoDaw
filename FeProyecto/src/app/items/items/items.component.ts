import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Item } from './item.model';
import { Subscription } from 'rxjs';
import { ItemsService } from './items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy{
  desplegarColumnas = ["denominacion",'ubicacion', 'conjuntoEquipo', 'equipo', 'marcaModelo', 'periocidad', 'categoria'];
  dataSource = new MatTableDataSource<Item>;
  private itemsSubscription!: Subscription;

  constructor(private itemsService: ItemsService) {}

  ngOnDestroy(): void {
    this.itemsSubscription.unsubscribe();
  }
  ngOnInit(): void {
    this.itemsService.obtenerItems();

    this.itemsSubscription= this.itemsService.obtenerActualListener().subscribe((items:Item[])=>{
      this.dataSource.data = items;
    });
  }
}

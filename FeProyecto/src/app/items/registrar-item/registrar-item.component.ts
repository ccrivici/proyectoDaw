import { Component, OnDestroy, OnInit } from '@angular/core';
import { ItemsService } from '../items/items.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-registrar-item',
  templateUrl: './registrar-item.component.html',
  styleUrls: ['./registrar-item.component.css']
})
export class RegistrarItemComponent implements  OnInit,OnDestroy{
  selectconjuntoEquipo!:string;
  selectEquipo!:string;


  constructor(private itemService: ItemsService) {  }

  registrarItem(form:NgForm){

  }
  ngOnDestroy(): void {

  }
  ngOnInit(): void {

  }
}

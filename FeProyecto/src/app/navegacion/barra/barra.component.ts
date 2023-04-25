import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-barra',
  templateUrl: './barra.component.html',
  styleUrls: ['./barra.component.css']
})
export class BarraComponent {

  @Output() menuToggle = new EventEmitter<void>();

  onMenuToggleDispatch(){
    this.menuToggle.emit();
  }

}

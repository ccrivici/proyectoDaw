import {ChangeDetectorRef,Component,EventEmitter,OnDestroy,OnInit,Output} from '@angular/core';
import { Subscription } from 'rxjs';
import { SeguridadService } from 'src/app/seguridad/seguridad.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css'],
})
export class InicioComponent implements OnInit, OnDestroy {
  usuarioSubscription!: Subscription;
  estadoUsuario!: boolean;
  @Output() menuToggle = new EventEmitter<void>();

  constructor( private seguridadService: SeguridadService) { }
  ngOnDestroy(): void {
    this.usuarioSubscription.unsubscribe();
  }

  ngOnInit(): void {
    // establecer estadoUsuario en true si hay un usuario activo
    if (this.seguridadService.onSesion()) {
      this.estadoUsuario = true;
    }
    this.usuarioSubscription = this.seguridadService.seguridadCambio.subscribe((status) => {
        this.estadoUsuario = status;
      }
    );
  }

  onCerrarMenu() {
    this.menuToggle.emit();
  }

  terminarSesionMenu() {
    this.onCerrarMenu();
    this.seguridadService.salirSesion();
  }
}

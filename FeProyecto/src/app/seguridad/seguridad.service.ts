import { Usuario } from './usuario.model';
import { LoginData } from './login-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

@Injectable()
export class SeguridadService {
  private usuario!: Usuario;
  seguridadCambio = new Subject<boolean>();

  /**
   *
   */
  constructor(private router: Router) {}

  registrarUsuario(usr: Usuario) {
    this.usuario = {
      email: usr.email,
      password: '',
      usuarioID: Math.round(Math.random() * 10000).toString(),
      nombre: usr.nombre,
      apellidos: usr.apellidos,
      username: usr.username,
    };

    this.seguridadCambio.next(true);
    this.router.navigate(['/']);
  }

  login(loginData: LoginData) {
    this.usuario = {
      email: loginData.email,
      usuarioID: Math.round(Math.random() * 10000).toString(),
      nombre: '',
      apellidos: '',
      username: '',
      password: '',
    };

    this.seguridadCambio.next(true);
    this.router.navigate(['/']);
  }

  salirSesion() {
    this.usuario;

    this.seguridadCambio.next(false);
    this.router.navigate(['/login']);
  }

  obtenerUsuario() {
    return { ...this.usuario };
  }

  onSesion() {
    return this.usuario !=null;
  }
}

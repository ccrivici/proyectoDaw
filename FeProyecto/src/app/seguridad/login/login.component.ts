import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SeguridadService } from '../seguridad.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private seguridadService: SeguridadService, private http: HttpClient) { }

  loginUsuario(form: NgForm) {
    this.seguridadService.login({
      email: form.value.email,
      password: form.value.password
    })
  }
}

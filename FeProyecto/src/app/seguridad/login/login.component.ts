import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SeguridadService } from '../seguridad.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private seguridadService: SeguridadService,private http:HttpClient) { }

  ngOnInit(): void {

  }

  loginUsuario(form: NgForm){
    this.seguridadService.login({
      email: form.value.email,
      password: form.value.password
    })
  }

}

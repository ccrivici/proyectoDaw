import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { SeguridadService } from '../seguridad.service';

@Component({
  selector: 'app-registrar',
  templateUrl: './registrar.component.html',
  styleUrls: ['./registrar.component.css']
})
export class RegistrarComponent implements OnInit {

  constructor(private seguridadService: SeguridadService) { }

  ngOnInit(): void {
  }

  registrarUsuario(form : NgForm){
    console.log(form);
    console.log(`
      email: ${form.value.email},
      password: ${form.value.password},
      nombre: ${form.value.nombre},
      apellidos: ${form.value.apellido},
      username: ${form.value.usuario}

    `)
    this.seguridadService.registrarUsuario({
      email: form.value.email,
      password: form.value.password,
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      username: form.value.usuario,
      usuarioID: '',
      token:''
    })
  }
  mostrar(){
    const input = (<HTMLInputElement>document.getElementById('pswd'));
    if (input.type == "text"){
      input.type="password"
    }else{
      input.type="text"
    }
  }
}

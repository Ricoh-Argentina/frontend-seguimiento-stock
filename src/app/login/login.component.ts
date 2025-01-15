import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { SecurityService } from '../services/security.service';
import { Global } from '../services/global';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
/*Para que funcione httpclient */
import { HttpClientModule } from '@angular/common/http';
/*Angular Material */
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, MatInputModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, MatButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
  providers: [UserService, SecurityService]
})
export class LoginComponent implements OnInit, DoCheck, OnDestroy {
  public status: string;
  public url: string;

  formularioUsuario = this._formBuilder.group({
    NOMBRE_USUARIO: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]],
    PASSWORD: ['', [
      Validators.required,
      Validators.minLength(4),
      Validators.maxLength(20)
    ]]
  });

  constructor(
    private _userService: UserService,
    private _securityService: SecurityService,
    private _router: Router,
    private _formBuilder: FormBuilder
  ) {
    this.status = "";
    this.url = Global.url;
  }


  get usuarioNombre(){
    return this.formularioUsuario.controls['NOMBRE_USUARIO'];
  }

  get password(){
    return this.formularioUsuario.controls['PASSWORD'];
  }

  ngOnInit(): void {
    if (this._securityService.isAuthenticated()) {
      this._router.navigateByUrl('/home');
    }
  }

  ngDoCheck(): void {

  }

  ngOnDestroy(): void {

  }

  login() {

    let bodydata = {
      usuario: this.usuarioNombre.value,
      password: this.password.value
    };

    this._userService.loginUser(bodydata).subscribe(
      {
        next: (resultado) => {
          //Guardo en el sessionStorage el usuario y el token
          this._securityService.saveUser(resultado.usuario);
          this._securityService.saveToken(resultado.token);

          if (resultado.usuario.estado) {
            this._router.navigateByUrl('/home');
          } else {
            alert("Usuario o Password Incorrecto");
          }

        },
        error: (error) => {
          this.status = "failed";
          if (error.status == 403 || error.status == 401) {

            alert("Usuario o clave incorrectas!!!");
          }
        },
        complete: () => console.info('Peticion Completada')
      }
    );
  }
}


import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BackServiceService } from '../servicos/back-service.service';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormulario: FormGroup;
  user: Usuario;
  description: string;
  msgError: string;
  statusLogin: boolean;
  @ViewChild('lform') loginFormDirective; //Acessa o formulario do template em HTML


  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private service: BackServiceService, 
    private router: Router) {
    this.description = "Por favor se indentifique primeiro";
    this.createForm();
  }


    ngOnInit() { 
      this.user = new Usuario();
    }


    createForm() {
      this.loginFormulario = this.fb.group({
        login: ['', Validators.required],
        senha: ['', Validators.required],
        checkRemember: ['', Validators.nullValidator]
      });

    }


    get f() { return this.loginFormulario.controls; }
    

    logar() {
      this.user.userName = this.loginFormulario.get('login').value;
      this.user.password = this.loginFormulario.get('senha').value;

      this.service.postLogaUsuario(this.user)
      .subscribe(status => this.statusLogin = status,
        msgError => this.msgError = <any>msgError);

      this.loginFormulario.reset({
        login: '',
        senha: ''
      });
      this.loginFormDirective.resetForm(); //Reseta o template
      this.dialogRef.close(this.loginFormulario.value);
    }


    cadastrar() {



    }

    logarComGoogle() {
      this.router.navigate(['/externalRedirect', { externalUrl: 'http://localhost:8080/myapp/oauth2/authorization/google' }]);
    }

    logarComEventoAS() {
      this.router.navigate(['/externalRedirect', { externalUrl: 'http://localhost:8080/myapp/oauth2/authorization/way2learnclient' }]);
    }
}

import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { BackServiceService } from '../servicos/back-service.service';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormulario: FormGroup;
  user: Usuario;
  description: string;
  msgError: string = null;
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

      this.service.loginLoading.next(true);

       this.service.postLogaUsuario(this.user)
      .subscribe((data: HttpResponse<any>) => {
        this.service.loginLoading.next(false);

        console.log("Cookie recebido: " + data.headers.get('authorization'));
        const user = new Usuario();
        user.authorization = data.headers.getAll('authorization')[0];
        this.service.authorization.next(user);

        this.close();
        this.msgError = null;
        this.router.navigate(['/eventos']);

      }, errorResponse => {
        console.log(errorResponse);
        this.msgError = errorResponse.statusText;
        this.service.loginLoading.next(false);
        this.resetForm();
      }
     );
    }

    resetForm() {
      this.loginFormulario.reset({
        login: '',
        senha: ''
      });

      this.loginFormDirective.resetForm();
    }

    close() {
      this.resetForm();
      this.dialogRef.close(this.loginFormulario.value);
    }
    

    logarComGoogle() {
      this.router.navigate(['/externalRedirect', { externalUrl: 'http://localhost:8080/myapp/oauth2/authorization/google' }]);
    }

    logarComEventoAS() {
      this.router.navigate(['/externalRedirect', { externalUrl: 'http://localhost:8080/myapp/oauth2/authorization/way2learnclient' }]);
    }
}

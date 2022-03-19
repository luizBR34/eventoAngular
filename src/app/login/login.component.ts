import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatDialogRef } from "@angular/material";
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { BackServiceService } from '../servicos/back-service.service';
import { HostNameService } from '../servicos/host-name.service';
import { Usuario } from '../models/usuario';
import { Router } from '@angular/router';
import { HttpResponse } from '@angular/common/http';
import { ExchangeDataService } from '../servicos/exchange-data.service';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { AuthenticatedUserService } from '../servicos/authenticated-user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginFormulario: FormGroup;
  description: string;
  msgError: string = null;
  statusLogin: boolean;

  @ViewChild('lform') loginFormDirective; //Acessa o formulario do template em HTML


  constructor(private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginComponent>,
    private callApi: BackServiceService,
    private exchangeData: ExchangeDataService,
    private persistenceService: AuthenticatedUserService,
    private hostNameService: HostNameService,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public dialogData: any) {
    this.description = "Por favor se indentifique primeiro";
    this.createForm();
  }


    ngOnInit() { }


    createForm() {
      this.loginFormulario = this.fb.group({
        login: ['', Validators.required],
        senha: ['', Validators.required],
        lembreSeDeMim: ['', Validators.nullValidator]
      });

    }


    get f() { return this.loginFormulario.controls; }
    

    logar() {

      let userName = this.loginFormulario.get('login').value;
      let password = this.loginFormulario.get('senha').value;

      this.exchangeData.setFlag(true);

      if (this.dialogData == "GET_TOKEN") {

        console.log("PEGAR NOVO TOKEN!");

        let user = new Usuario();
        user.userName = userName;
        user.token = "Basic bWljcm9jbGllbnQ6c2VjcmV0";
        this.persistenceService.addUser("loggedUser", user);

        this.callApi.getToken(userName, password)
        .subscribe((response) => {

          user.token = "Bearer " + response.access_token;
          this.persistenceService.addUser("loggedUser", user);

          this.exchangeData.setFlag(false);
          this.close();
          this.msgError = null;
          this.router.navigate(['/eventos']);
        }
      );

      } else {

        this.persistenceService.removeUser("loggedUser");

        this.callApi.postLogaUsuario(userName, password)
        .subscribe((data: HttpResponse<any>) => {

          this.exchangeData.setFlag(false);
          this.close();
          this.msgError = null;
          this.router.navigate(['/eventos']);
  
        }, errorResponse => {

          if (errorResponse.status == 404) {

            this.msgError = errorResponse.statusText;
            this.exchangeData.setFlag(false);
            this.resetForm();

          } else {

            //this.router.navigate(['/externalRedirect', { externalUrl: 'https://localhost:8443/myapp/oauth2/authorization/eventoas' }]);
            this.router.navigate(['/externalRedirect', { externalUrl: this.hostNameService.getEventoAppHost() + '/oauth2/authorization/eventoas' }]);
          }
        }
        );
      }
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
      //this.router.navigate(['/externalRedirect', { externalUrl: 'https://localhost:8443/myapp/oauth2/authorization/google' }]);
      this.router.navigate(['/externalRedirect', { externalUrl: this.hostNameService.getEventoAppHost() + '/oauth2/authorization/google' }]);
    }
}

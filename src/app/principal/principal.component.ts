import { Component, OnInit } from '@angular/core';
import { BackServiceService } from '../servicos/back-service.service';
import { Evento } from '../models/evento';
import { MatDialog } from '@angular/material'; 
import { LoginComponent } from '../login/login.component';
import { dialogConfig } from '../shared/dialogConfig';
import { ExchangeDataService } from '../servicos/exchange-data.service';
import { Usuario } from '../models/usuario';
import { AuthenticatedUserService } from '../servicos/authenticated-user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  eventos: Evento[] = [];
  msgError = null;
  isFetching = false;

  navigationSubscription;

  constructor(private callApi: BackServiceService,
    private exchangeData: ExchangeDataService,
    private persistenceService: AuthenticatedUserService,
    private rota: ActivatedRoute,
    private dialog: MatDialog) { }


    atualizaListaEventos() {

      let authenticatedUser = this.persistenceService.getUser("loggedUser");

      if ((!authenticatedUser) || (!authenticatedUser.userName)) {

        this.openLoginForm();

      } else {

        console.log("PrincipalComponent: Usuario logado");
        console.log(authenticatedUser.userName);

        this.isFetching = true;

        this.callApi.getEventos(authenticatedUser.userName)
        .subscribe(eventsReceived => {
          this.isFetching = false;
          this.msgError = null;
          this.eventos = eventsReceived
        }, errorResponse => { 
          this.isFetching = false;
          this.msgError = errorResponse
        });
      }
    }


  
  ngOnInit() {

    this.rota.queryParams
    .subscribe((params) => {

      if (params['username']) {
        console.log("PARAMS PASSADO:");
        console.log(params);
        let authenticatedUser = new Usuario();
        authenticatedUser.userName = params.username;
        authenticatedUser.token = "Bearer " + params.token;
        this.persistenceService.addUser("loggedUser", authenticatedUser);
      }

    });

    this.atualizaListaEventos();
  }


  getAuthenticatedUser(): Usuario {

    let usuario;

    this.exchangeData.getUser().subscribe(user => {
      usuario = user;
      }
    );

    return usuario;
  }


  onHandleError() {
    this.msgError = null;
  }


  onDeleteEvento(cod: number) {

    let authenticatedUser = this.persistenceService.getUser("loggedUser");

    this.callApi.deleteEvento(authenticatedUser.userName, cod)
    .subscribe(() => {
      this.msgError = null;
    }, error => {
        this.msgError = error.statusText;
    });

    if (this.msgError == null) {
      this.dialog.closeAll();

      setTimeout (() => {
        this.atualizaListaEventos();
      }, 1000);
      
    } else {
      this.openLoginForm();
    }
  }



  openLoginForm(): void {

    dialogConfig.data = "GET_TOKEN";
    let dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    ); 
  }

}







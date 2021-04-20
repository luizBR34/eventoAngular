import { Component, OnInit } from '@angular/core';
import { BackServiceService } from '../servicos/back-service.service';
import { Evento } from '../models/evento';

import { MatDialog } from '@angular/material'; // --> USADO PARA DIALOGO
import { LoginComponent } from '../login/login.component';// --> USADO PARA DIALOGO
import { ActivatedRoute } from '@angular/router';
import { dialogConfig } from '../shared/dialogConfig';

@Component({
  selector: 'app-principal',
  templateUrl: './principal.component.html',
  styleUrls: ['./principal.component.css']
})
export class PrincipalComponent implements OnInit {

  eventos: Evento[] = [];
  msgError: string;
  login: boolean;
  isFetching = false;

  navigationSubscription;

  constructor(private service: BackServiceService,
    private rota: ActivatedRoute,
    private dialog: MatDialog) { }


    atualizaListaEventos() {
      setTimeout (() => {
        this.service.getEventos()
        .subscribe((eventos) => this.eventos = eventos,
        msgError => this.msgError = <any>msgError);
      }, 500);
    }


  
  ngOnInit() {

    this.rota.queryParams
      .subscribe(params => {
        this.login = params.login;
      });

    this.isFetching = true;

    this.service.getEventos()
    .subscribe(eventsReceived => {
      this.isFetching = false;
      this.eventos = eventsReceived
    }, msgError => this.msgError = <any>msgError);

      if (this.login) {
        this.openLoginForm();
      }
  }


  onDeleteEvento(cod: number) {

    let estado = this.service.deleteEvento(cod);

    if (estado == 404) {
      this.openLoginForm();
    } else {
      this.dialog.closeAll();
    }

    this.atualizaListaEventos();
  }



  openLoginForm(): void {

    let dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    ); 
  }

}







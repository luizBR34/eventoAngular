import { Component, OnInit } from '@angular/core';
import { BackServiceService } from '../servicos/back-service.service';
import { Evento } from '../models/evento';

import { MatDialog } from '@angular/material'; // --> USADO PARA DIALOGO
import { LoginComponent } from '../login/login.component';// --> USADO PARA DIALOGO
import { dialogConfig } from '../shared/dialogConfig';

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

  constructor(private service: BackServiceService,
    private dialog: MatDialog) { }


    atualizaListaEventos() {

      this.isFetching = true;

      this.service.getEventos()
      .subscribe(eventsReceived => {
        this.isFetching = false;
        this.msgError = null;
        this.eventos = eventsReceived
      }, errorResponse => { 
        this.isFetching = false;
        this.msgError = errorResponse 
      });
    }


  
  ngOnInit() {

    this.atualizaListaEventos();
  }


  onHandleError() {
    this.msgError = null;
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







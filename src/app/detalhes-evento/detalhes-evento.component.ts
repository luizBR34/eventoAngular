import { Component, OnInit, ViewChild } from '@angular/core';
import { Evento } from '../models/evento';
import { Convidado } from '../models/Convidado';
import { BackServiceService } from '../servicos/back-service.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material'; // --> USADO PARA DIALOGO
import { LoginComponent } from '../login/login.component';// --> USADO PARA DIALOGO
import { dialogConfig } from '../shared/dialogConfig';
import { AuthenticatedUserService } from '../servicos/authenticated-user.service';


@Component({
  selector: 'app-detalhes-evento',
  templateUrl: './detalhes-evento.component.html',
  styleUrls: ['./detalhes-evento.component.css']
})
export class DetalhesEventoComponent implements OnInit {

  event: Evento;
  convidados: Convidado[];
  msgError: string;
  codigo: number; 

  @ViewChild('cadastraConvidadoForm') convidadoFormDirective; 

  convidado = new Convidado();

  navigationSubscription;

  constructor(private callApi: BackServiceService,
    private rota: ActivatedRoute,
    private r: Router,
    private persistenceService: AuthenticatedUserService,
    private dialog: MatDialog) {

      this.convidado.id = 0;
      this.convidado.guestName = '';

      this.navigationSubscription = this.r.events.subscribe((e: any) => {
        // If it is a NavigationEnd event re-initalise the component
        if (e instanceof NavigationEnd) {
          //this.atualizaListaConvidados();
        }
      });

    }


/*     atualizaListaConvidados() {

      setTimeout (() => {
        this.service.getListaConvidados(this.event.code)
        .subscribe((convidados) => this.convidados = convidados,
        msgError => this.msgError = <any>msgError);
      }, 500);

    } */

  ngOnInit() {
    
    this.event = new Evento();

    this.rota.params.subscribe(params => {
      this.codigo = params['id'];
    });

    let authenticatedUser = this.persistenceService.getUser("loggedUser");

    this.callApi.getEvento(authenticatedUser.userName, this.codigo)
    .subscribe(event => { 
      console.log(event);
      this.event = event
    }, errorResponse => { 
        this.msgError = errorResponse.message;
        console.log(errorResponse);
      }
    );


    //this.atualizaListaConvidados();
  }


  deletar(guest: Convidado) {
    this.callApi.deleteConvidado(guest.id)
    .subscribe(event => this.event = event,
    msgError => this.msgError = <any>msgError);
  
      if (this.msgError == '404') {
        this.openLoginForm();
      } else {
        this.dialog.closeAll();
      }
  }
  
  
  adicionar() {

    let retorno = this.callApi.postCadastraConvidados(this.codigo, this.convidado);

    if (retorno == 404) {
      this.openLoginForm();
    } else {
      this.dialog.closeAll();
    }
    
    this.convidadoFormDirective.resetForm();

    //this.atualizaListaConvidados();
  }



  openLoginForm(): void {

    let dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    ); 
  }
  
}

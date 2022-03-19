import { Component, OnInit, ViewChild } from '@angular/core';
import { Evento } from '../models/evento';
import { Convidado } from '../models/convidado';
import { BackServiceService } from '../servicos/back-service.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { MatDialog } from '@angular/material'; // --> USADO PARA DIALOGO
import { LoginComponent } from '../login/login.component';// --> USADO PARA DIALOGO
import { dialogConfig } from '../shared/dialogConfig';
import { AuthenticatedUserService } from '../servicos/authenticated-user.service';
import { Usuario } from '../models/usuario';


@Component({
  selector: 'app-detalhes-evento',
  templateUrl: './detalhes-evento.component.html',
  styleUrls: ['./detalhes-evento.component.css']
})
export class DetalhesEventoComponent implements OnInit {

  event: Evento = new Evento();
  user: Usuario = null;
  convidados: Convidado[] = [];
  convidado = new Convidado();
  msgError: string;
  codigo: number; 

  @ViewChild('cadastraConvidadoForm') convidadoFormDirective; 


  navigationSubscription;

  constructor(private callApi: BackServiceService,
    private rota: ActivatedRoute,
    private r: Router,
    private persistenceService: AuthenticatedUserService,
    private dialog: MatDialog) {

      this.navigationSubscription = this.r.events.subscribe((e: any) => {
        if (e instanceof NavigationEnd) {
          this.atualizaListaConvidados();
        }
      });

    }


  atualizaListaConvidados() {

    if ((this.user != null) && (this.event != null)) {
      this.callApi.getListaConvidados(this.user.userName, this.event.code)
      .subscribe((convidados) => this.convidados = convidados,
      msgError => this.msgError = <any>msgError);
    } else {
      console.log("ERROR: Unable to get the guest list!");
    }
  }

  ngOnInit() {
    
    this.rota.params.subscribe(params => {
      this.codigo = params['id'];
    });

    this.user = this.persistenceService.getUser("loggedUser");

    this.callApi.getEvento(this.user.userName, this.codigo)
    .subscribe(response => { 
      this.event = response;
      this.convidado.event = response;
      this.atualizaListaConvidados();
    }, errorResponse => { 
        this.msgError = errorResponse.message;
        console.log(errorResponse);
      }
    );

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

    this.callApi.postCadastraConvidados(this.user.userName, this.codigo, this.convidado)
    .subscribe(() => {
      this.dialog.closeAll();
      //this.atualizaListaConvidados();
    }, error => {
      this.openLoginForm();
      console.log("An Error occour when to get response from server!");
    });

    this.convidadoFormDirective.resetForm();    
  }



  openLoginForm(): void {

    dialogConfig.data = "GET_TOKEN";
    let dialogRef = this.dialog.open(LoginComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => console.log("Dialog output:", data)
    ); 
  }
  
}

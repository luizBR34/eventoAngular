import { Component, OnInit, ViewChild } from '@angular/core';
import { Evento } from '../models/evento';
import { BackServiceService } from '../servicos/back-service.service';
import { AuthenticatedUserService } from '../servicos/authenticated-user.service';

@Component({
  selector: 'app-form-evento',
  templateUrl: './form-evento.component.html',
  styleUrls: ['./form-evento.component.css']
})
export class FormEventoComponent implements OnInit {

  evento = new Evento();
  statusGravaEvento: boolean;
  status: boolean = false;
  isFetching: boolean = false;
  msgError = null;

  @ViewChild('eventoForm') eventoFormDirective;

  constructor(private callApi: BackServiceService,
    private persistenceService: AuthenticatedUserService) { 

    this.evento.name = '';
    this.evento.city = '';
    this.evento.date = '';
    this.evento.time = '';
  }

  ngOnInit() {
  }

  onSubmit() {

    this.isFetching = true;

    let user = this.persistenceService.getUser("loggedUser");

    this.callApi.postCadastraEvento(user.userName, this.evento)
    .subscribe((response) => {
      this.isFetching = false;
      this.status = true;
      this.msgError = null;
    }, error => {
        this.isFetching = false;
        this.status = false;
        this.msgError = error.statusText;
        console.log("An Error occour when to get response from server!");
      });

    this.eventoFormDirective.resetForm();
  }

  onConfirm() {
    this.status = false;
  }

  onHandleError() {
    this.msgError = null;
  }
}

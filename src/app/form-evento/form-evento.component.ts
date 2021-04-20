import { Component, OnInit, ViewChild } from '@angular/core';
import { Evento } from '../models/evento';
import { BackServiceService } from '../servicos/back-service.service';

@Component({
  selector: 'app-form-evento',
  templateUrl: './form-evento.component.html',
  styleUrls: ['./form-evento.component.css']
})
export class FormEventoComponent implements OnInit {

  evento = new Evento();
  statusGravaEvento: boolean;
  msgError: string;

  @ViewChild('eventoForm') eventoFormDirective;

  constructor(private service: BackServiceService) { 

    this.evento.name = '';
    this.evento.city = '';
    this.evento.date = '';
    this.evento.time = '';
  }

  ngOnInit() {
  }

  onSubmit() {
    this.service.postCadastraEvento(this.evento)
    .subscribe(statusGravacao => this.statusGravaEvento = statusGravacao,
      msgError => this.msgError = <any>msgError);

      this.eventoFormDirective.resetForm();
  }

}

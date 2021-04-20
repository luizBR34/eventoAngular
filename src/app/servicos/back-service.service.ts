import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { catchError, retry, map, } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Evento } from '../models/evento';
import { Convidado } from '../models/Convidado';
import { Usuario } from '../models/usuario';


const httpOptions = {
  headers: new HttpHeaders({
    'content-type': 'application/json'
  })
};


@Injectable({
  providedIn: 'root'
})
export class BackServiceService {

  resposta_Delete_Evento: number;
  resposta_Grava_Convidado: number;

  constructor(private http: HttpClient,
              private ProcessHTTPMsgService: ProcessHTTPMsgService) {
      this.resposta_Delete_Evento = 200;
      this.resposta_Grava_Convidado = 200;
  }


  postLogaUsuario(user: Usuario): Observable<boolean> {
    const url = `${baseURL}/logar/`;

    const formOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams()
    .set('username', user.userName)
    .set('password', user.password);

    return this.http.post<boolean>(url, params, formOptions)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }



getUsuario(): Observable<Usuario> {
  const url = `${baseURL}/loggedUser/`;
  return this.http.get<Usuario>(url)
  .pipe(catchError(this.ProcessHTTPMsgService.handleError)); 
}



  getEventos(): Observable<Evento[]> {
    const url = `${baseURL}/events/`;
    return this.http.get<Evento[]>(url)
    .pipe(map(responseData => {
      const eventList: Evento[] = [];
      for (const key in responseData) {
        eventList.push(responseData[key])
      }
      return eventList;
    }))
    //.pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }

  getEvento(codigo: number): Observable<Evento> {
    return this.http.get<Evento>(baseURL + "/seekEvent/" + codigo)
    .pipe(retry(3), catchError(this.ProcessHTTPMsgService.handleError));
  }



  postCadastraEvento(evento: Evento): Observable<boolean> {
    const url = `${baseURL}/cadastrarEvento/`;
    return this.http.post<boolean>(url, evento, httpOptions)
    .pipe(retry(3), catchError(this.ProcessHTTPMsgService.handleError));
  }


  deleteEvento(codigo: number): number {

    let cod_retorno: number;

    const url = `${baseURL}/deletarEvento/${codigo}`;
    this.http.delete(url, {observe: 'response'})
    .subscribe(response => {
      this.resposta_Delete_Evento = response.status;
      }, 
      error => {
        if(error.status == 404)
        this.resposta_Delete_Evento = error.status;
      }
    );

    cod_retorno = this.resposta_Delete_Evento;
    return cod_retorno
  }


  getListaConvidados(codigo: number): Observable<Convidado[]> {
    const url = `${baseURL}/guestList/${codigo}`;
    return this.http.get<Convidado[]>(url)
    .pipe(retry(3), catchError(this.ProcessHTTPMsgService.handleError));
  }


  postCadastraConvidados(codEvento: number, convidado: Convidado): number {

    let cod_retorno: number;

    const url = `${baseURL}/cadastrarConvidado/${codEvento}`;
    this.http.post(url, convidado, {observe: 'response'})
    .subscribe(response => {
      this.resposta_Grava_Convidado = response.status;
      }, 
      error => {
        if(error.status == 404)
        this.resposta_Grava_Convidado = error.status;
      }
    );

    cod_retorno = this.resposta_Grava_Convidado;
    return cod_retorno
  }



  deleteConvidado(id: number): Observable<Evento> {
    const url = `${baseURL}/deletarConvidado/${id}`;
    return this.http.delete<Evento>(url, httpOptions)
    .pipe(catchError(this.ProcessHTTPMsgService.handleError));
  }
}

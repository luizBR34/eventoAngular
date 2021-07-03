import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { baseURL } from '../shared/baseurl';
import { Observable, Subject } from 'rxjs';
import { catchError, retry, map, tap, } from 'rxjs/operators';
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
  error = new Subject<string>();

  constructor(private http: HttpClient,
              private httpServiceErrorHandler: ProcessHTTPMsgService) {
      this.resposta_Delete_Evento = 200;
      this.resposta_Grava_Convidado = 200;
  }


  postLogaUsuario(user: Usuario): Observable<void> {
    const url = `${baseURL}/logar/`;

    const formOptions = {
      headers: new HttpHeaders({
        'content-type': 'application/x-www-form-urlencoded'
      })
    };

    const params = new HttpParams()
    .set('username', user.userName)
    .set('password', user.password);

    return this.http.post<void>(url, params, formOptions)
    //.pipe(catchError(this.httpServiceErrorHandler.handleError));
  }



getUsuario(): Observable<Usuario> {
  const url = `${baseURL}/loggedUser/`;
  return this.http.get<Usuario>(url)
  .pipe(catchError(this.httpServiceErrorHandler.handleError));
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
    }), catchError(this.httpServiceErrorHandler.handleError)
   );
  }

  getEvento(codigo: number): Observable<Evento> {
    return this.http.get<Evento>(baseURL + "/seekEvent/" + codigo)
    .pipe(retry(3), catchError(this.httpServiceErrorHandler.handleError));
  }

  postCadastraEvento(evento: Evento): boolean {
    const url = `${baseURL}/saveEvent/`;
    let result = false;
    this.http.post(url, evento,
      { 
        headers: new HttpHeaders({ 'content-type' : 'application/json' }),
        observe: 'events' 
      }).pipe(tap(event => {
        if (event.type === HttpEventType.Sent) {
          console.log("Event was successfully sent to the server!");
          result = true;
        }
      })
    )
    .subscribe(() => { }, 
      error => {
        console.log("An Error occour when to get response from server!");
      });
      return result;
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
    .pipe(retry(3), catchError(this.httpServiceErrorHandler.handleError));
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
    .pipe(catchError(this.httpServiceErrorHandler.handleError));
  }
}

import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType, HttpUserEvent, HttpEvent, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { baseURL, baseURL2, baseURL3 } from '../shared/baseurl';
import { Observable } from 'rxjs';
import { catchError, retry, map, tap, } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Evento } from '../models/evento';
import { Convidado } from '../models/Convidado';
import { TokenResponse } from '../models/tokenResponse';
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

  resposta_Grava_Convidado: number;

  constructor(private http: HttpClient,
              private httpServiceErrorHandler: ProcessHTTPMsgService) {
      this.resposta_Grava_Convidado = 200;
  }



  postLogaUsuario(username: string, password: string): Observable<HttpResponse<any>> {

    const url = `${baseURL3}/logar/`;

    const params = new HttpParams()
    .set('username', username)
    .set('password', password);

    return this.http.post<any>(url, params,
    { 
      headers: new HttpHeaders({ 'Content-Type' : 'application/x-www-form-urlencoded' })
      .append('Cache-Control', 'max-age=0'),
      observe: 'response' as 'body'
    })
    .pipe(map(user => {
      return user;
    }));
  }



  getToken(username: string, password: string): Observable<TokenResponse> {

    const url = `${baseURL3}/oauth/token`;

    const params = new HttpParams()
    .set('grant_type', 'password')
    .set('username', username)
    .set('password', password);

    return this.http.post<TokenResponse>(url, params,
      { 
        headers: new HttpHeaders({ 'Content-Type' : 'application/x-www-form-urlencoded' })
        .append('cache-control', 'no-cache')
      })
      .pipe(catchError(this.httpServiceErrorHandler.handleError));
  }



  getEventos(username: string): Observable<Evento[]> {
    const url = `${baseURL}/events/` + username;
    return this.http.get<Evento[]>(url,
      { 
        headers: new HttpHeaders({ 'content-type' : 'application/json' })
      })
    .pipe(map(responseData => {
      const eventList: Evento[] = [];
      for (const key in responseData) {
        eventList.push(responseData[key])
      }
      return eventList;
    }), catchError(this.httpServiceErrorHandler.handleError)
   );
  }

  getEvento(username: string, codigo: number): Observable<Evento> {
    const url = `${baseURL}/seekEvent/${codigo}/`;
    return this.http.get<Evento>(url,
      { 
        headers: new HttpHeaders({ 'username' : username })
      })
    .pipe(catchError(this.httpServiceErrorHandler.handleError));
  }

  postCadastraEvento(username: string, evento: Evento): Observable<HttpEvent<void>> {
    const url = `${baseURL}/saveEvent/`;

    return this.http.post<void>(url, evento,
      { 
        headers: new HttpHeaders({ 'content-type' : 'application/json' })
        .append('username', username),
        observe: 'events' 
      }).pipe(tap(event => {
        if (event.type === HttpEventType.Sent) {
          console.log("Event was successfully sent to the server!");
        }
      })
    );
  }
  


  deleteEvento(username: string, codigo: number): Observable<HttpEvent<void>> {

      const url = `${baseURL}/deleteEvent/${codigo}`;
      return this.http.delete<void>(url, 
        {
          headers: new HttpHeaders({ 'username' : username }), 
          observe: 'events'})
      .pipe(tap(event => {
        if (event.type === HttpEventType.Sent) {
          console.log("The request to Delete Event was sent successfully!");
        }
      }
     )
    );
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

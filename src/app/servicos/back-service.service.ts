import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams, HttpEventType, HttpUserEvent, HttpEvent, HttpResponse } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { HostNameService } from './host-name.service';
import { Observable } from 'rxjs';
import { catchError, retry, map, tap, } from 'rxjs/operators';
import { ProcessHTTPMsgService } from './process-httpmsg.service';
import { Evento } from '../models/evento';
import { Convidado } from '../models/convidado';
import { TokenResponse } from '../models/tokenResponse';


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
              private httpServiceErrorHandler: ProcessHTTPMsgService,
              private hostNameService: HostNameService) {
      this.resposta_Grava_Convidado = 200;
  }


  postLogaUsuario(username: string, password: string): Observable<HttpResponse<any>> {

    const url = this.hostNameService.getEventoASHost() + `/logar/`;

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

    const url = this.hostNameService.getEventoASHost() + `/oauth/token`;

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

    const url = this.hostNameService.getEventoRSHost() + `/events/` + username;
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

    const url = this.hostNameService.getEventoRSHost() + `/seekEvent/${codigo}/`;
    return this.http.get<Evento>(url,
      { 
        headers: new HttpHeaders({ 'username' : username })
      })
    .pipe(catchError(this.httpServiceErrorHandler.handleError));
  }

  postCadastraEvento(username: string, evento: Evento): Observable<HttpEvent<void>> {

    const url = this.hostNameService.getEventoRSHost() + `/saveEvent/`;

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

      const url = this.hostNameService.getEventoRSHost() + `/deleteEvent/${codigo}`;
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


  getListaConvidados(username: string, codigo: number): Observable<Convidado[]> {

    const url = this.hostNameService.getEventoRSHost() + `/guestList/`;

    const OPTIONS = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json'
      }),
      params: new HttpParams().append('username', username)
                              .append('eventCode', codigo.toString())
  };

    return this.http.get<Convidado[]>(url, OPTIONS)
    .pipe(catchError(this.httpServiceErrorHandler.handleError));
  }


  postCadastraConvidados(username: string, eventCode: number, guest: Convidado): Observable<HttpEvent<void>> {

    const url = this.hostNameService.getEventoRSHost() + `/saveGuest/`;

    return this.http.post<void>(url, guest, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'}),
      params: new HttpParams().append('username', username)
                              .append('eventCode', eventCode.toString()),
      observe: 'events'
      }
    ).pipe(tap(event => {
      if (event.type === HttpEventType.Sent) {
        console.log("Guest was successfully sent to the server!");
      }
    })
   );
  }


  deleteConvidado(id: number): Observable<Evento> {
 
    const url = this.hostNameService.getEventoRSHost() + `/deleteGuest/${id}`;
    return this.http.delete<Evento>(url, httpOptions)
    .pipe(catchError(this.httpServiceErrorHandler.handleError));
  }
}

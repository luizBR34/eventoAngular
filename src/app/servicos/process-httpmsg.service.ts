import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any) {
    let errMsg: string;

    if (error.error instanceof ErrorEvent) {

      errMsg = error.error.message;
      console.error('Ocorreu um erro no cliente: ', errMsg);

    } else {

        errMsg = `${error.status}`;
        console.error('Ocorreu um erro na resposta do servidor: ', errMsg);
    }

    return throwError(errMsg);
  }
}

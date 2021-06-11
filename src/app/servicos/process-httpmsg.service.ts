import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProcessHTTPMsgService {

  constructor() { }

  public handleError(error: HttpErrorResponse | any) {
    let errorMessage: string;

    if (error.error instanceof ErrorEvent) {

      errorMessage = `An Error occurred on client side: ${error.error.message}`;
      console.log(errorMessage);

    } else {

        errorMessage = `Error Code: ${error.status}\n Message: ${error.message}`;
        console.log(errorMessage);
    }

    return throwError(errorMessage);
  }
}

import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType, HttpEvent } from '@angular/common/http';
import { tap, take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { BackServiceService } from './back-service.service';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private service: BackServiceService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return this.service.authorization.pipe(
            take(1),
            exhaustMap(user => {

                if (!user) {
                    return next.handle(req);
                }

                const modifiedRequest = req.clone({
                    //headers: req.headers.append('cookie', user.authorization),
                    withCredentials: true
                });

/*                 const modifiedRequest02 = req.clone({
                    params: new HttpParams().set('auth', user.token)
                }); */

                return next.handle(modifiedRequest)
                .pipe(tap(event => {
                    if (event.type === HttpEventType.Response) {
                        console.log("Resposta chegou! Corpo: ");
                        console.log(event.body);
                    }
                }));

            }
          )
        );


    }
}
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType, HttpEvent } from '@angular/common/http';
import { tap, take, exhaustMap } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthenticatedUserService } from './authenticated-user.service';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authenticatedUser: AuthenticatedUserService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        if ((this.authenticatedUser.getUser("loggedUser") == null) || (!this.authenticatedUser.getUser("loggedUser").userName)) {
            console.log("NENHUM USUARIO AUTHENTICADO:");
            return next.handle(req);
        }

        let user = this.authenticatedUser.getUser("loggedUser");
        console.log("DADOS DO USUARIO:");
        console.log(user);

        const modifiedRequest = req.clone({
            headers: req.headers.append('Authorization', user.token)
            //withCredentials: true
        });

/*          const modifiedRequest02 = req.clone({
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
}
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
            console.log("Nobody was authenticated!");
            return next.handle(req);
        }

        let user = this.authenticatedUser.getUser("loggedUser");

        const modifiedRequest = req.clone({
            headers: req.headers.append('Authorization', user.token)
        });

/*          const modifiedRequest02 = req.clone({
            params: new HttpParams().set('auth', user.token)
        }); */

        return next.handle(modifiedRequest)
        .pipe(tap(event => {
            if (event.type === HttpEventType.Response) {
                console.log(event.body);
            }
        }));

    }
}
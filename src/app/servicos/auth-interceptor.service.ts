import { HttpInterceptor, HttpRequest, HttpHandler, HttpEventType } from '@angular/common/http';
import { tap } from 'rxjs/operators';

export class AuthInterceptorService implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler) {

        console.log('Request esta a caminho!');
        console.log('URL: ' + req.url);

        const modifiedRequest = req.clone({
            headers: req.headers.append('Auth', 'xyz')
        });

        return next.handle(modifiedRequest)
        .pipe(tap(event => {
            console.log("Events: ");
            console.log(event);
            if (event.type === HttpEventType.Response) {
                console.log("Resposta chegou! Corpo: ");
                console.log(event.body);
            }
        }));
    }
}
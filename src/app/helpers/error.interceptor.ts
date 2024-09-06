import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(
        private auth: AuthService,
        private readonly layout: LayoutService
    ) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            if (err.status === 401) {
                // auto logout if 401 response returned from api
                this.auth.logout();
                location.reload(true);
            }
            let errorMessage = '';
            if(err.status == 422){     
                Object.keys(err.error).forEach((key: string) => {
                    errorMessage += err.error[key][0] +'<br>';
                });  
                this.layout.openConfirmDialog('Erro', errorMessage, false);
                return;
            }   
            if(err.status == 409 || err.status == 500){    
                this.layout.openConfirmDialog('Erro', 'Falha na API, entre em contato com o administrador do sistema.', false);
                return;
            }            
            const error = err.error.message || err.statusText;
            return throwError(error);
        }))
    }
}
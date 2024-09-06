import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/src/client';
import { HttpHeaders } from '@angular/common/http/src/headers';
import { Usuario } from 'src/app/interfaces/usuario';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';

@Injectable({
  providedIn: 'root'
})
export class RestApiService {

  apiURL = 'http://localhost:3000';

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  

  constructor(
    private http: HttpClient,
    private readonly auth: AuthService,
    private readonly layout: LayoutService
  ) { }

  getUsuarios(): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiURL + '/usuarios')
    .pipe(
      retry(1),
      catchError(error => {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = error;
        }
        this.layout.openConfirmDialog('Erro', errorMessage, false);
        return throwError(error);
      })
    )
  }
}

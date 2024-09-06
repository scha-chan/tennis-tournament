import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Usuario, UsuarioForm, SenhaUsuario } from 'src/app/interfaces/usuario';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private readonly auth: AuthService,
    private readonly layout: LayoutService
  ) { }  

  public getUsuarios(): Observable<Usuario[]> {
    return this.http.get<Usuario[]>(environment.apiUrl + 'usuarios')
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
  public getUsuario(id: string): Observable<Usuario> {
    return this.http.get<Usuario>(environment.apiUrl + 'usuario/'+id)
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

  public updateUsuario(user: Usuario): Observable<Usuario> {
    return this.http.put<Usuario>(environment.apiUrl + 'usuario', user)
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

  public createUsuario(user: Usuario): Observable<Usuario> {
    return this.http.post<Usuario>(environment.apiUrl + 'usuario', user)
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

  public deleteUsuario(id: string) {
    return this.http.delete<any>(environment.apiUrl + 'usuario/'+id)
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

  public generatePasswordToken(email: string): Observable<string> {
    return this.http.post<string>(environment.apiUrl + 'password/reset-request', {email})
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

  public updatePassword(senhas: SenhaUsuario): Observable<string> {
    return this.http.post<string>(environment.apiUrl + 'password/reset', senhas)
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

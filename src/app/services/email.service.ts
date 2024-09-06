import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor(
    private http: HttpClient,
    private readonly auth: AuthService
  ) { }

  public sendmailNewUser(idUser: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'mail-welcome/'+idUser.toString())
    .pipe(
      retry(1),
      catchError(error => {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = error;
        }
        return throwError(error);
      })
    )
  } 

  public sendmailUserAprovado(idUser: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'mail-user-aprovado/'+idUser.toString())
    .pipe(
      retry(1),
      catchError(error => {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = error;
        }
        return throwError(error);
      })
    )
  } 

  public sendmailUserDesafiado(idDesafio: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'mail-user-desafiado/'+idDesafio.toString())
    .pipe(
      retry(1),
      catchError(error => {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = error;
        }
        return throwError(error);
      })
    )
  }

  public sendmailDesafioAtualizado(idDesafio: number): Observable<any> {
    return this.http.get<any>(environment.apiUrl + 'mail-desafio-atualizado/'+idDesafio.toString())
    .pipe(
      retry(1),
      catchError(error => {
        let errorMessage = '';
        if(error.error instanceof ErrorEvent) {
          errorMessage = error.error.message;
        } else {
          errorMessage = error;
        }
        return throwError(error);
      })
    )
  }

  
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Usuario, UsuarioDesafio } from 'src/app/interfaces/usuario';
import { environment } from '../../environments/environment';
import { Desafio, DesafioPost, DesafioResult } from 'src/app/interfaces/desafio';
import { ValidateUser } from 'src/app/interfaces/ranking';

@Injectable({
  providedIn: 'root'
})
export class DesafioService {

  constructor(
    private http: HttpClient,
    private readonly auth: AuthService,
    private readonly layout: LayoutService
  ) { }

  public getDesafios(): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(environment.apiUrl + 'desafios')
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

  public getDesafiosRanking(week: number, year: number): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(environment.apiUrl + 'desafios/'+week+'/'+year)
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

  public getDesafio(id: string): Observable<Desafio> {
    return this.http.get<Desafio>(environment.apiUrl + 'desafio/'+id)
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

  public updateDesafio(desafio: DesafioPost): Observable<DesafioResult> {
    return this.http.put<DesafioResult>(environment.apiUrl + 'desafio', desafio)
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

  public createDesafio(desafio: DesafioPost): Observable<DesafioResult> {
    return this.http.post<DesafioResult>(environment.apiUrl + 'desafio', desafio)
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

  public deleteDesafio(id: string) {
    return this.http.delete<any>(environment.apiUrl + 'desafio/'+id)
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

  public getDesafiados(user: string, week: string, year: string): Observable<UsuarioDesafio[]> {
    return this.http.get<UsuarioDesafio[]>(environment.apiUrl + 'desafiar/'+user+'/'+week+'/'+year)
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

  public getDesafiosPlacar(week: number, year: number, user: number): Observable<Desafio[]> {
    return this.http.get<Desafio[]>(environment.apiUrl + 'desafios-placar/'+week.toString()+'/'+year.toString()+'/'+user.toString())
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

  public validateUser(user:number, week: number, year: number): Observable<ValidateUser> {
    return this.http.get<ValidateUser>(environment.apiUrl + 'validate-user/'+user+'/'+year+'/'+week)
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

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from 'src/app/services/auth.service';
import { LayoutService } from 'src/app/services/layout.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Ranking, Periodo } from 'src/app/interfaces/ranking';
import { Placar } from 'src/app/interfaces/pontuacao';

@Injectable({
  providedIn: 'root'
})
export class ResultadoService {

  constructor(
    private http: HttpClient,
    private readonly auth: AuthService,
    private readonly layout: LayoutService
  ) { }

  public getLastRanking(): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(environment.apiUrl + 'ultimo-ranking')
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

  public getRankingByWeekYear(week: number, year: number): Observable<Ranking[]> {
    return this.http.get<Ranking[]>(environment.apiUrl + 'ranking/'+week+'/'+year)
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
  
  public getPeriodos(): Observable<Periodo[]> {
    return this.http.get<Periodo[]>(environment.apiUrl + 'periodos')
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

  public contarDesafios(): Observable<number> {
    return this.http.get<number>(environment.apiUrl + 'contar-desafios')
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
  
  public getPlacar(week: number, year: number, user:number): Observable<Placar[]> {
    return this.http.get<Placar[]>(environment.apiUrl + 'resultados/'+week+'/'+year+'/'+user)
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

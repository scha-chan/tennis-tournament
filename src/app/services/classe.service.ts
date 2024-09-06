import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LayoutService } from 'src/app/services/layout.service';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Situacao } from 'src/app/interfaces/usuario';
import { environment } from '../../environments/environment';
import { Classe } from 'src/app/interfaces/classe';

@Injectable({
  providedIn: 'root'
})
export class ClasseService {

  constructor(
    private http: HttpClient,
    private readonly layout: LayoutService
  ) { }

  public getClasses(): Observable<Classe[]> {
    return this.http.get<Classe[]>(environment.apiUrl + 'classes')
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

  public updateClasse(user: Classe): Observable<Classe> {
    return this.http.put<Classe>(environment.apiUrl + 'classe', user)
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

  public createClasse(user: Classe): Observable<Classe> {
    return this.http.post<Classe>(environment.apiUrl + 'classe', user)
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

  public deleteClasse(id: string) {
    return this.http.delete<any>(environment.apiUrl + 'classe/'+id)
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

  public getSituacoes(): Observable<Situacao[]> {
    return this.http.get<Situacao[]>(environment.apiUrl + 'situacoes')
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

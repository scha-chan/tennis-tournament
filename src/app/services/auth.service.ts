import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AuthGroup } from 'src/app/interfaces/authorization.types';
import { Usuario, Situacao } from 'src/app/interfaces/usuario';
import { Observable } from 'rxjs/internal/Observable';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { map, catchError } from 'rxjs/internal/operators';
import { throwError } from 'rxjs/internal/observable/throwError';
import { CurrentUser } from 'src/app/interfaces/currentUser';
import { environment } from '../../environments/environment';
import { EncrDecrService } from 'src/app/services/encr-decr.service';
import { LayoutService } from 'src/app/services/layout.service';
import { HttpErrorResponse } from '@angular/common/http/src/response';
import { ClasseService } from 'src/app/services/classe.service';
import { Classe } from 'src/app/interfaces/classe';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private currentUserSubject: BehaviorSubject<CurrentUser>;
  public currentUser: Observable<CurrentUser>;

  constructor(
    private readonly jwtHelper: JwtHelperService,
    private readonly http: HttpClient,
    private readonly cript: EncrDecrService,
    private readonly layout: LayoutService,
    private readonly classeService: ClasseService
  ) { 
      this.currentUserSubject = new BehaviorSubject<CurrentUser>(this.getCurrentUser());
      this.currentUser = this.currentUserSubject.asObservable();
  }

  public get currentUserValue(): CurrentUser {
    return this.currentUserSubject.value;
  }

  private getCurrentUser() {
    if (!localStorage.getItem('currentUser')) {
      return;
    }
    return JSON.parse(this.cript.decrypt(environment.secret, localStorage.getItem('currentUser')));
  }

  public getSituacoes() : Situacao[] {
    if (!localStorage.getItem('situacoes')) {
      this.classeService.getSituacoes().subscribe(situacoes => {           
        localStorage.setItem('situacoes', this.cript.encrypt(environment.secret, JSON.stringify(situacoes)));
      });
      return;
    }
    return JSON.parse(this.cript.decrypt(environment.secret, localStorage.getItem('situacoes')));
  }

  public getClasses() : Classe[] {
    if (!localStorage.getItem('classes')) {
      this.classeService.getClasses().subscribe(classes => {      
        this.setClasses(classes);
      });
      return;
    }
    return JSON.parse(this.cript.decrypt(environment.secret, localStorage.getItem('classes')));
  }

  public setClasses(classes)  {
    localStorage.setItem('classes', this.cript.encrypt(environment.secret, JSON.stringify(classes)));
  }

  public clearLogin() {
    if (localStorage.getItem('token') || localStorage.getItem('currentUser')) {
      localStorage.clear();      
      location.reload(); 
    }     
  }

  public isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    // Check whether the token is expired and return
    // true or false
    return !this.jwtHelper.isTokenExpired(token);
  }  

  public login(email:string, password:string ) {
    return this.http.post<CurrentUser>(environment.apiUrl+'login', {email, password})
      .pipe(
        map(user => {
          // login successful if there's a jwt token in the response
          if (user && user.access_token) {
              // store user details and jwt token in local storage to keep user logged in between page refreshes
              localStorage.setItem('currentUser', this.cript.encrypt(environment.secret, JSON.stringify(user)));
              localStorage.setItem('token', user.access_token);
              this.currentUserSubject.next(user);    
              this.setLocalStorage();          
          }
          return user;
      }),
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
    );        
  }

  public setLocalStorage() {
    this.classeService.getClasses().subscribe(classes => {      
      this.setClasses(classes);
    });
    this.classeService.getSituacoes().subscribe(situacoes => {           
      localStorage.setItem('situacoes', this.cript.encrypt(environment.secret, JSON.stringify(situacoes)));
    });
  }

  public hasPermission(authGroup: AuthGroup) {
    return this.currentUserValue.user.tipo === authGroup;   
  }

  public isAdmin() {
      if (!this.currentUserValue) {
        return false;
      }
      return this.currentUserValue.user.tipo == 'A';
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
    this.currentUserSubject.next(null);
  }

  private getServerErrorMessage(error: HttpErrorResponse): string {
    switch (error.status) {
        case 404: {
            return `Not Found: ${error.message}`;
        }
        case 403: {
            return `Access Denied: ${error.message}`;
        }
        case 500: {
            return `Internal Server Error: ${error.message}`;
        }
        default: {
            return `Unknown Server Error: ${error.message}`;
        }

    }
}

}

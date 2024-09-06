import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http/src/client';
import { Usuario } from 'src/app/interfaces/usuario';
import { Observable, throwError } from 'rxjs';
import { AuthGroup } from 'src/app/interfaces/authorization.types';
import { AuthService } from 'src/app/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private readonly auth: AuthService
  ) {}    

  public login(email:string, password:string ) {
    return this.auth.login(email, password);         
  }   
  
}

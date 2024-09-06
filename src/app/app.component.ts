import { Component } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  public title = 'Tênis - Bela Vista';
  public data;

  constructor(
    private readonly auth: AuthService    
  ) {      
    var d = new Date();
    this.data = d.getFullYear();
  }

  // public get isLoggedIn(): boolean {
  //   return this.auth.isAuthenticated();
  // }

}

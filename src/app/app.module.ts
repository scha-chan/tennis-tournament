import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { UsuarioComponent } from './pages/usuario/usuario.component';
import { ResultadoComponent } from './pages/resultado/resultado.component';
import { NotfoundComponent } from './pages/notfound/notfound.component';
import { LoginComponent } from './pages/login/login.component';
import { DesafioComponent } from './pages/desafio/desafio.component';
import { HomeComponent } from './pages/home/home.component';
import { HeaderComponent } from './header/header.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { NgDatepickerModule } from 'ng2-datepicker';
import { HttpClientModule, HTTP_INTERCEPTORS }  from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ErrorInterceptor } from 'src/app/helpers/error.interceptor';
import { JwtInterceptor } from 'src/app/helpers/jwt.interceptor';
import { AppComponent } from 'src/app/app.component';
import { DesafioCadastroComponent } from 'src/app/pages/desafio/desafio-cadastro/desafio-cadastro.component';
import { UsuarioCadastroComponent } from 'src/app/pages/usuario/usuario-cadastro/usuario-cadastro.component';
import { JwtModule } from '@auth0/angular-jwt';
import { EncrDecrService } from 'src/app/services/encr-decr.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap/modal/modal.module';
import { UsuarioPerfilComponent } from 'src/app/pages/usuario/usuario-perfil/usuario-perfil.component';
import { TableComponent } from './shared/table/table.component';
import { AngularFontAwesomeModule } from 'angular-font-awesome';
import { PaginationComponent } from './shared/pagination/pagination.component';
import { TitleComponent } from './shared/title/title.component';
import { PlacarComponent } from './shared/placar/placar.component';
import { NgxMaskModule } from 'ngx-mask'
import { ClasseComponent } from 'src/app/pages/classe/classe.component';
import { ClasseCadastroComponent } from 'src/app/pages/classe/classe-cadastro/classe-cadastro.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import ptBr from '@angular/common/locales/pt';
import { ResultComponent } from 'src/app/shared/result/result.component';
import { RankingComponent } from './pages/ranking/ranking.component';
import { RecuperarSenhaComponent } from './pages/recuperar-senha/recuperar-senha.component';
registerLocaleData(ptBr)

export function tokenGetter() {
  return localStorage.getItem("token");
}

@NgModule({
  imports: [    
    NgbModule.forRoot(),
    NgDatepickerModule,
    HttpClientModule,
    ReactiveFormsModule,
    RouterModule,
    BrowserModule,
    AppRoutingModule,
    AngularFontAwesomeModule,
    NgxMaskModule.forRoot(),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter    
      },
    }),
  ],
  declarations: [
    AppComponent,
    UsuarioComponent,
    UsuarioCadastroComponent,
    ResultadoComponent,
    NotfoundComponent,
    LoginComponent,
    DesafioComponent,
    DesafioCadastroComponent,
    HomeComponent,
    HeaderComponent,
    ConfirmDialogComponent,
    UsuarioPerfilComponent,
    TableComponent,
    PaginationComponent,
    TitleComponent,
    PlacarComponent,
    ClasseComponent,
    ClasseCadastroComponent,
    ResultComponent,
    RankingComponent,
    RecuperarSenhaComponent
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    { provide: LOCALE_ID, useValue: "pt" },
    EncrDecrService
  ],
  bootstrap: [AppComponent],
  entryComponents: [ ConfirmDialogComponent ]
})
export class AppModule { }

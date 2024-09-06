import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from 'src/app/pages/home/home.component';
import { UsuarioComponent } from 'src/app/pages/usuario/usuario.component';
import { NotfoundComponent } from 'src/app/pages/notfound/notfound.component';
import { UsuarioCadastroComponent } from 'src/app/pages/usuario/usuario-cadastro/usuario-cadastro.component';
import {  AuthGuardService as AuthGuard  } from 'src/app/services/auth-guard.service';
import { LoginComponent } from 'src/app/pages/login/login.component';
import { DesafioComponent } from 'src/app/pages/desafio/desafio.component';
import { ResultadoComponent } from 'src/app/pages/resultado/resultado.component';
import { DesafioCadastroComponent } from 'src/app/pages/desafio/desafio-cadastro/desafio-cadastro.component';
import { UsuarioPerfilComponent } from 'src/app/pages/usuario/usuario-perfil/usuario-perfil.component';
import { ClasseComponent } from 'src/app/pages/classe/classe.component';
import { ClasseCadastroComponent } from 'src/app/pages/classe/classe-cadastro/classe-cadastro.component';
import { RankingComponent } from 'src/app/pages/ranking/ranking.component';
import { RecuperarSenhaComponent } from 'src/app/pages/recuperar-senha/recuperar-senha.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { 
    path: 'classes',
    component: ClasseComponent,
    canLoad: [AuthGuard]
  },
  { 
    path: 'classe/cadastro/:id',
    component: ClasseCadastroComponent,
    canLoad: [AuthGuard] 
  },
  { 
    path: 'classe/cadastro',
    component: ClasseCadastroComponent,
    canLoad: [AuthGuard] 
  },
  { 
    path: 'desafios',
    component: DesafioComponent,
    canLoad: [AuthGuard] 
  },
  { 
    path: 'desafio/cadastro/:id',
    component: DesafioCadastroComponent,
    canLoad: [AuthGuard] 
  },
  { 
    path: 'desafio/cadastro',
    component: DesafioCadastroComponent,
    canLoad: [AuthGuard]
  },
  { 
    path: 'ranking',
    component: RankingComponent,
    canLoad: [] 
  },
  { 
    path: 'resultados',
    component: ResultadoComponent,
    canLoad: [] 
  },
  { 
    path: 'jogadores',
    component: UsuarioComponent,
    canLoad: [AuthGuard]
  },
  { 
    path: 'jogador/cadastro/:id',
    component: UsuarioCadastroComponent,
    canLoad: [AuthGuard]
  },
  { 
    path: 'jogador/cadastro',
    component: UsuarioCadastroComponent,
    canLoad: []
  },
  { 
    path: 'perfil',
    component: UsuarioPerfilComponent,
    canLoad: [AuthGuard]   
  },
  { 
    path: 'perfil/:id',
    component: UsuarioPerfilComponent,
    canLoad: []
  },
  { 
    path: 'login',
    component: LoginComponent
  },
  { 
    path: 'recuperar-senha',
    component: RecuperarSenhaComponent
  },
  { 
    path: 'recuperar-senha/:token',
    component: RecuperarSenhaComponent
  },
  { 
    path: 'notfound',
    component: NotfoundComponent,
    canLoad: [],
  },  
  { path: '**', redirectTo: 'notfound' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

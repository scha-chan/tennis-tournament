import { Component, OnInit, HostListener } from '@angular/core';
import { LayoutService } from 'src/app/services/layout.service';
import { AuthService } from 'src/app/services/auth.service';
import { Menu, Login } from 'src/app/interfaces/menu';
import { Usuario } from 'src/app/interfaces/usuario';
import { DesafioService } from 'src/app/services/desafio.service';
import * as moment from 'moment';

@Component({
  selector: 'game-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public menus: Menu[];
  public currentUser: Usuario;
  public login: Login = <Login>{ };
  public loading = false;
  public activeMenu = false;

  @HostListener('document:click', ['$event']) onDocumentClick(event) {
    this.toogleMenu();
  }

  constructor(
    private readonly layout: LayoutService,
    private readonly auth: AuthService,
    private readonly desafioService: DesafioService
  ) {
   }

  ngOnInit() {
    this.menus = [          
       { 
        nome: 'Resultados',
        link: '/resultados',
        tipo: 'L',
        icone: ''
       },
       { 
        nome: 'Ranking',
        link: '/ranking',
        tipo: 'L',
        icone: ''
       },
       { 
        nome: !this.isAdmin ? 'Meus Desafios' : 'Desafios',
        link: '/desafios',
        tipo: 'T',
        icone: ''
       },
       { 
        nome: 'Usuários',
        link: '/jogadores',
        tipo: 'A',
        icone: ''
       },
       { 
        nome: 'Classes',
        link: '/classes',
        tipo: 'A',
        icone: ''
       },
       { 
        nome: 'Perfil',
        link: '/perfil',
        tipo: 'J',
        icone: ''
       }
    ];
    if (this.auth.isAuthenticated()) {
      this.currentUser = this.auth.currentUserValue.user;
      this.getUserValidation();
    } else {
      this.sair();
    }
    this.menus = this.menus.filter(menu => menu.tipo == 'L' || 
                                  (menu.tipo == 'T' && typeof this.currentUser !== 'undefined' ) ||
                                  (menu.tipo == 'A' && this.isAdmin) || 
                                  (menu.tipo == 'J' && !this.isAdmin && typeof this.currentUser !== 'undefined' ) );
    
  }

  public getUserValidation() {
    if (this.currentUser) {
      const semana = moment().week();
      this.desafioService.validateUser(this.currentUser.id,semana, moment().year()).subscribe(response => {
        if (!response.jaDesafiou && !this.isAdmin) {
            this.menus.push({
              nome: '<span class="destaque">Marcar desafio</span>',
              link: '/desafio/cadastro',
              tipo: 'J',
              icone: ''
            });
        }
      });      
    }    
  }

  public get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  public get isAuthenticated(): boolean {
    return localStorage.getItem('token') ? true : false;
  }

  public logar() { 
    this.loading = true;      
    if (this.login.email && this.login.password) {
        this.auth.login(this.login.email, this.login.password)
            .subscribe(
                () => {
                    this.loading = false;            
                    location.reload();
                }
            );
    } else {
        this.loading = false;     
    }
  }

  public toogleMenu() { 
    this.activeMenu = !this.activeMenu;        
  }  

  public sair() { 
    this.auth.clearLogin()            
  }  
}

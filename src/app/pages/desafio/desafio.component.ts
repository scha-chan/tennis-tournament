import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { TableHeader, TableFilter } from 'src/app/interfaces/table';
import { DesafioService } from 'src/app/services/desafio.service';
import { Desafio } from 'src/app/interfaces/desafio';
import { CurrentUser } from 'src/app/interfaces/currentUser';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { Periodo } from 'src/app/interfaces/ranking';
import { ResultadoService } from 'src/app/services/resultado.service';

@Component({
  selector: 'app-desafio',
  templateUrl: './desafio.component.html',
  styleUrls: ['./desafio.component.scss']
})
export class DesafioComponent implements OnInit {

  public desafios: Desafio[] = [];
  public desafiosPaginated: Desafio[] = [];
  public desafio: Desafio;
  public periodos: Periodo[] = [];
  public periodo: Periodo;
  public jogadores: Usuario[] = [];
  public jogador = '';
  public currentUser: Usuario;
  public podeDesafiar = true;
  public semana;
  public loading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly desafioService: DesafioService,
    private readonly resultadoService: ResultadoService,
    private readonly router: Router,
    private readonly layout: LayoutService
  ) { }

  ngOnInit() {
    this.currentUser = this.auth.currentUserValue.user;
    this.semana = this.layout.getAtualWeek();
    this.periodos.push(this.layout.getPeriodo(this.semana['week'], this.semana['year']));
    this.periodo = this.periodos[0]; 
    this.getPeriodos();
    this.getUserValidation();
    this.getDesafios(this.semana['week'],this.semana['year']);
  }

  public get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  public getUserValidation() {
    if (this.currentUser) {
      this.desafioService.validateUser(this.currentUser.id,this.semana['week'], this.semana['year']).subscribe(response => {
        if (response.noRanking || response.jaDesafiou) {
          this.podeDesafiar = false;
        }
      });
      if(this.isAdmin) {
        this.podeDesafiar = false;
      }
    }
    
  }

  public getDesafios(week: number, year: number) {
    this.loading = true;
    this.desafioService.getDesafiosRanking(week, year).subscribe(desafios => {     
      if (!this.isAdmin) {        
        this.desafios = desafios.filter(item => 
          item.desafiante.id == this.auth.currentUserValue.user.id || 
          item.desafiado.id == this.auth.currentUserValue.user.id
        )
      } else {
        this.desafios = desafios;      
      }
      this.desafios = this.desafios.map(item => {
        item.dataDesafio = moment(item.dataDesafio, 'YYYY-MM-DD HH:mm' ).format('DD/MM/YYYY HH:mm');       
        if (item.desafiante) {
          let avatar = item.desafiante.avatar ? item.desafiante.avatar : 'default.jpg';  
          item.desafiante.avatar_img = environment.apiImg + avatar;
          item.desafiante.user_img = '<img src="'+item.desafiante.avatar_img +'"  alt=""> '+item.desafiante.nome;
          if (!this.jogadores.find(user => user.id == item.desafiante.id)){
            this.jogadores.push(item.desafiante);
          }
        } else {
          item.desafiante = <Usuario>{ };
        }      
        if (item.desafiado) { 
          let avatar = item.desafiado.avatar ? item.desafiado.avatar : 'default.jpg';
          item.desafiado.avatar_img = environment.apiImg + avatar;
          item.desafiado.user_img = '<img src="'+ item.desafiado.avatar_img +'" alt=""> '+item.desafiado.nome;
          if (!this.jogadores.find(user => user.id == item.desafiado.id)){
            this.jogadores.push(item.desafiado);
          }
        } else {         
            item.desafiado = <Usuario>{ };         
        }
        return item;
      }); 
      console.log(this.desafios);
      this.filterJogador(); 
      this.loading = false;
    });
  }

  public buscarDesafio() {
    console.log(this.periodo);
    if (!this.periodo) {      
      return;
    }
    this.getDesafios(this.periodo.semana, this.periodo.ano); 
  }

  private getPeriodos() {
    this.resultadoService.getPeriodos().subscribe(periodos => {
      periodos.map(periodo => {
        periodo.dataFim = moment(periodo.dataFim, 'YYYY-MM-DD');
        periodo.dataInicio = moment(periodo.dataInicio, 'YYYY-MM-DD');
        this.periodos.push(periodo); 
      });
    });
  }

  public deleteDesafio(id: number) {  
    this.desafioService.deleteDesafio(id.toString()).subscribe(response => {
      this.desafios = this.desafios.filter(item => item.id !== id);
      this.filterJogador();
      this.layout.openConfirmDialog('Sucesso', 'Desafio removido com sucesso!', false);
    });
  }

  public editDesafio(id: number) {
    this.router.navigate(['desafio/cadastro/'+id]);
  }

  public adicionarDesafio() {
    this.router.navigate(['desafio/cadastro']);
  }

  public clickTable(event) {
      if (event.action == 'editar') {
        this.editDesafio(event.item.id);
        return;
      }
      if (event.action == 'remover') {
        this.desafio = event.item;
        this.layout.openConfirmDialog('Aviso','Você realmente deseja remover esse desafio?', true)
        .then(() => { this.deleteDesafio(event.item.id) }, () => { } );    ;        
        return;
      }      
  }

  public filterPeriodo() {
    this.desafiosPaginated = this.desafios.filter(item => {
      let data = moment(item.dataDesafio, 'DD/MM/YYYY' );
      return  data.isSameOrAfter(this.periodo.dataInicio) && data.isSameOrBefore(this.periodo.dataFim);
    } );
  }

  public filterJogador() {
    if (this.jogador == '') {
      this.desafiosPaginated = this.desafios;
      return;
    }
    this.desafiosPaginated = this.desafios.filter(item => {
      let data = moment(item.dataDesafio, 'DD/MM/YYYY' );
       return  data.isSameOrAfter(this.periodo.dataInicio) && data.isSameOrBefore(this.periodo.dataFim)
              && (item.desafiante.nome.toLowerCase().indexOf(this.jogador.toLowerCase()) != -1  || 
                  item.desafiado.nome.toLowerCase().indexOf(this.jogador.toLowerCase()) != -1)
    } );
  }

}

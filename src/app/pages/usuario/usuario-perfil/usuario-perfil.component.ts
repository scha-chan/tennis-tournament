import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { Usuario, Situacao } from 'src/app/interfaces/usuario';
import { Classe } from 'src/app/interfaces/classe';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { ResultadoService } from 'src/app/services/resultado.service';
import { Ranking } from 'src/app/interfaces/ranking';
import { ActivatedRoute } from '@angular/router';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'game-usuario-perfil',
  templateUrl: './usuario-perfil.component.html',
  styleUrls: ['./usuario-perfil.component.scss']
})
export class UsuarioPerfilComponent implements OnInit {

  public usuario: Usuario = <Usuario>{ };
  public rankings: Ranking[];
  public classes: Classe[];
  public situacoes: Situacao[];
  public id: number;
  public partidas = 0;
  public vitorias = 0;
  public derrotas = 0;
  public posicao = '';
  public rota = '';

  constructor(
    private readonly auth: AuthService,
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly layout: LayoutService,
    private readonly classeService: ClasseService
  ) { 
    this.activatedRoute.paramMap.subscribe(
      params => {
        this.id = parseInt(params.get('id'));        
      }
    );  
  }

  ngOnInit() {
    if (!this.id) {
      if (!this.auth.currentUserValue) {
        this.router.navigate(['/']);
        return;
      }
      this.id = this.auth.currentUserValue.user.id;
      this.rota = 'jogador/cadastro/'+this.id;      
    }
    this.getClasses(); 
    this.situacoes = this.auth.getSituacoes(); 
  }

  public getClasses() {   
    this.classeService.getClasses().subscribe(classes => {      
     this.classes = classes;  
     this.getUsuario();
    });
  }

  public getUsuario() {    
    this.usuarioService.getUsuario(this.id.toString()).subscribe(usuario => {
      this.usuario = usuario;
      this.usuario.dataNascimento = this.usuario.dataNascimento ? moment(this.usuario.dataNascimento, 'YYYY-MM-DD' ).format('DD/MM/YYYY') : null;
      this.usuario.avatar = environment.apiImg + usuario.avatar;      
      this.usuario.ativo_nome = this.situacoes.find(item => item.id == this.usuario.ativo).nome;
      this.usuario.classe_nome = this.classes.find(item => item.id == this.usuario.classe).nome;
      this.rankings = usuario.ranking.map(item => {
        const periodo = this.layout.getPeriodo(item.semana, item.ano);
        item.dataInicio = periodo.dataInicio.format('DD/MM/YYYY');
        item.dataFim = periodo.dataFim.format('DD/MM/YYYY');
        return item;
      });
      const lastRanking = this.rankings.filter(rank => {
          return rank.semana == moment().week() -1 && rank.ano == moment().year();
      })[0];
      this.posicao  = lastRanking.posicao;
      this.partidas = lastRanking.partidas; //this.rankings.reduce((sum, current) => sum + current.partidas, 0);
      this.vitorias = lastRanking.vitorias; //this.rankings.reduce((sum, current) => sum + current.vitorias, 0);
      this.derrotas = lastRanking.derrotas; // this.rankings.reduce((sum, current) => sum + current.derrotas, 0);

    });
  } 
}

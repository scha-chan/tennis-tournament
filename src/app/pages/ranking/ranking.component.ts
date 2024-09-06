
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ResultadoService } from 'src/app/services/resultado.service';
import { Ranking, Periodo } from 'src/app/interfaces/ranking';
import { Classe } from 'src/app/interfaces/classe';
import { Situacao, Usuario } from 'src/app/interfaces/usuario';
import { Banner } from 'src/app/interfaces/banner';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { LayoutService } from 'src/app/services/layout.service';
import { TableHeader } from 'src/app/interfaces/table';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'game-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss']
})
export class RankingComponent implements OnInit {

  public ranking: Ranking[];
  public rankingPaginated: Ranking[];
  public classes: Classe[];
  public situacoes: Situacao[];
  public periodos: Periodo[] = [];
  public periodo: Periodo;
  public week: number;
  public year: number;
  public classesPaginated: Classe[] = [];
  public tableHeader: TableHeader[];
  public limit = 25;
  public page = 1;
  public jogador = '';

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly layout: LayoutService,
    private readonly resultadoService: ResultadoService,
    private readonly classeService: ClasseService
  ) { }

  ngOnInit() {
    this.getClasses(); 
    this.getPeriodos();
     this.situacoes = this.auth.getSituacoes();   
     this.tableHeader = [
      { nome: 'Pos.', alias: 'posicao', sortable: true }  ,   
      { nome: 'Jogador', alias: 'usuario.user_img', sortable: true },    
      { nome: 'Classe', alias: 'usuario.classe_nome', sortable: true },  
      { nome: 'Situação', alias: 'usuario.ativo_nome', sortable: true }, 
      { nome: 'Partidas', alias: 'partidas', sortable: true }, 
      { nome: 'Vitórias', alias: 'vitorias', sortable: true }, 
      { nome: 'Derrotas', alias: 'derrotas', sortable: true },         
    ];    
     
  }

  public get total(): number {
    return !this.ranking ? 0 : this.ranking.length;
  }

  public getClasses() {   
    this.classeService.getClasses().subscribe(classes => {      
     this.classes = classes;  
    });
  }

  public buscarRanking() {
    if (!this.periodo) {      
      return;
    }
    this.getRanking(this.periodo.semana, this.periodo.ano); 
  }

  private getPeriodos() {
    this.resultadoService.getPeriodos().subscribe(periodos => {
      this.periodos = periodos.map(periodo => {
        periodo.dataFim = moment(periodo.dataFim, 'YYYY-MM-DD');
        periodo.dataInicio = moment(periodo.dataInicio, 'YYYY-MM-DD');
        return periodo;
      });
      this.periodo = this.periodos[0];
      this.getRanking(this.periodo.semana, this.periodo.ano); 
    });
  }

  private getRanking(week:number, year:number) {
    this.resultadoService.getRankingByWeekYear(week, year).subscribe(ranking => {
      this.ranking = ranking.map(rank => {
        rank.usuario.classe_nome = this.classes.find(item => item.id == rank.usuario.classe).nome;
        rank.usuario.ativo_nome = this.situacoes.find(item => item.id == rank.usuario.ativo).nome;
        let avatar = rank.usuario.avatar ? rank.usuario.avatar : 'default.jpg';  
        rank.usuario.avatar_img = environment.apiImg + avatar;
        rank.usuario.user_img = '<img src="'+environment.apiImg + avatar +'"  alt=""> '+rank.usuario.nome;
        rank.posicao = rank.posicao + 'º';
        return rank;
      });
      this.jogador = '';
      this.paginate(1);
    });
  }

  public paginate(page: number) {
    this.page = page;
    if (this.jogador != '') {
      this.rankingPaginated = this.ranking.filter(rank => rank.usuario.nome.toLowerCase().indexOf(this.jogador.toLowerCase()) != -1);
      this.rankingPaginated = this.rankingPaginated.filter((rank, index) => index < (this.limit * page));
      return
    }
    this.rankingPaginated = this.ranking.filter((rank, index) => index < (this.limit * page));
  }

  public sortTable(item: TableHeader) {
    const index = this.tableHeader.findIndex((obj => obj.alias == item.alias));
    const sort = !item.sort ? 'asc' : item.sort == 'desc' ? 'asc' : 'desc';
    if (sort == 'asc') {
      this.ranking.sort((one, two) => (one[item.alias] < two[item.alias] ? -1 : 1));
    } else {
      this.ranking.sort((one, two) => (one[item.alias] > two[item.alias] ? -1 : 1));
    }   
    this.paginate(1);
    this.tableHeader.map((obj,i) => {
      if (i != index) {
        delete obj.sort;
      }  else {
        obj.sort = sort;
      }    
    });    
  }
}

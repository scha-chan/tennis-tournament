import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { ResultadoService } from 'src/app/services/resultado.service';
import { Desafio } from 'src/app/interfaces/desafio';
import { Ranking } from 'src/app/interfaces/ranking';
import { Classe } from 'src/app/interfaces/classe';
import { Situacao, Usuario } from 'src/app/interfaces/usuario';
import { Placar } from 'src/app/interfaces/pontuacao';
import { Banner } from 'src/app/interfaces/banner';
import { environment } from 'src/environments/environment';
import * as moment from 'moment';
import { LayoutService } from 'src/app/services/layout.service';
import { DesafioService } from 'src/app/services/desafio.service';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public desafios: Desafio[];
  public ranking: Ranking[];
  public vitorias: Ranking[];
  public classes: Classe[];
  public placar: Placar[];
  public nextDesafio: Desafio;
  public week: number;
  public year: number;
  public publicidadeSidebar : Banner;
  public numeroJogos = 0;
  public numeroJogadores = 0;

  constructor(
    private readonly auth: AuthService,
    private readonly router: Router,
    private readonly layout: LayoutService,
    private readonly resultadoService: ResultadoService,
    private readonly desafioService: DesafioService,
    private readonly classeService: ClasseService
  ) { }

  ngOnInit() {
     this.getClasses(); 
     this.week = moment().week();
     this.year = moment().year();   
     this.publicidadeSidebar = { id:1, titulo: 'Patrocinadores', imagem: '' }

  }

  public getClasses() {   
    this.classeService.getClasses().subscribe(classes => {      
     this.classes = classes;
     this.getRanking();
     this.getPlacar();
     this.contarDesafios();
    });
  }

  private getRanking() {
    this.resultadoService.getLastRanking().subscribe(ranking => {
      ranking = ranking.map(rank => {
        rank.usuario.classe_nome = this.classes.find(item => item.id == rank.usuario.classe).nome;
        if (rank.usuario.ativo == 1) {
          this.numeroJogadores++;
        }  
        return rank;
      });      
      this.ranking =  JSON.parse(JSON.stringify(ranking));
      this.vitorias = ranking.sort((one, two) => (one.vitorias > two.vitorias ? -1 : 1));
    });
  }

  private contarDesafios() {
    this.resultadoService.contarDesafios().subscribe(total => {
      this.numeroJogos = total;
    });
  }

  private getDesafios() {   
    const intervaloAtual = this.layout.getPeriodo(this.week,this.year); 
    this.desafioService.getDesafiosPlacar(this.week, this.year, 0).subscribe(desafios => {
      desafios = desafios.filter(item => {
        let data = moment(item.dataDesafio, 'YYYY-MM-DD' );  
        return  data.isSameOrAfter(intervaloAtual.dataInicio) && data.isSameOrBefore(intervaloAtual.dataFim);
      });  
      this.nextDesafio = this.setDesafio(desafios.reverse().filter(
          item => item.vitorias_desafiado == 0 && item.vitorias_desafiante == 0 && moment(item.dataDesafio, 'YYYY-MM-DD HH:mm').isAfter(moment())
      )[0]);
      desafios = desafios.filter(item =>item.vitorias_desafiado != 0 || item.vitorias_desafiante != 0);
      this.desafios = desafios.map(desafio => {   
        return this.setDesafio(desafio);
      }); 
    });
    
  } 

  private getPlacar() {
    this.resultadoService.getPlacar(0,0,0).subscribe(placar => {
      this.placar = placar;
      this.getDesafios();
    });
  }

  private setDesafio(desafio) {
    if (!desafio) {
      return desafio;
    }
    desafio.dataDesafio = moment(desafio.dataDesafio, 'YYYY-MM-DD HH:mm' ).format('DD/MM/YYYY HH:mm');  
    if (desafio.desafiante) {
      let avatar = desafio.desafiante.avatar ? desafio.desafiante.avatar : 'default.jpg';
      desafio.desafiante.avatar_img = environment.apiImg + avatar;
      desafio.desafiante.classe_nome = this.classes.find(item => item.id == desafio.desafiante.classe).nome;
    } else {
      desafio.desafiante = <Usuario>{ };
    }      
    if (desafio.desafiado) { 
      let avatar = desafio.desafiado.avatar ? desafio.desafiado.avatar : 'default.jpg';
      desafio.desafiado.avatar_img = environment.apiImg + avatar;
      desafio.desafiado.classe_nome = this.classes.find(item => item.id == desafio.desafiado.classe).nome;
    } else {         
      desafio.desafiado = <Usuario>{ };         
    }
    return desafio;
  }

}

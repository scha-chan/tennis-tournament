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
import { Ranking, Periodo } from 'src/app/interfaces/ranking';
import { DesafioService } from 'src/app/services/desafio.service';
import { Desafio } from 'src/app/interfaces/desafio';
import { Placar } from 'src/app/interfaces/pontuacao';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'game-resultado-perfil',
  templateUrl: './resultado.component.html',
  styleUrls: ['./resultado.component.scss']
})
export class ResultadoComponent implements OnInit {

  public desafiosAll: Desafio[];
  public desafios: Desafio[];
  public ranking: Ranking[];
  public classes: Classe[];
  public situacoes: Situacao[];
  public placar: Placar[];
  public periodos: Periodo[] = [];
  public periodo: Periodo;
  public intervaloAtual: Periodo;

  constructor(
    private readonly auth: AuthService,
    private readonly desafioService: DesafioService,
    private readonly resultadoService: ResultadoService,
    private readonly router: Router,
    private readonly layout: LayoutService,
    private readonly classeService: ClasseService
  ) { }

  ngOnInit() {
    this.intervaloAtual = this.layout.getPeriodo(moment().week(), moment().year()); 
    this.getClasses(); 
    this.situacoes = this.auth.getSituacoes();     
  }

  public getClasses() {   
    this.classeService.getClasses().subscribe(classes => {      
     this.classes = classes;     
     this.getPlacar();
    });
  }

  public filterPeriodo() {
    this.desafios = this.desafiosAll.filter(item => {
      if (!item) {
        return;
      }
      let data = moment(item.dataDesafio, 'DD/MM/YYYY' );
      return  data.isSameOrAfter(this.periodo.dataInicio) && data.isSameOrBefore(this.periodo.dataFim);
    } );
  }

  private getDesafios() {    
    this.desafioService.getDesafios().subscribe(desafios => {
      desafios = desafios.map(desafio => {  
        let pontos = 0;
        let data = moment(desafio.dataDesafio, 'YYYY-MM-DD HH:mm' );
        this.periodos = this.layout.setPeriodo(data, this.periodos);
        desafio.dataDesafio =  data.format('DD/MM/YYYY HH:mm'); 
        if (desafio.desafiante) {
          let avatar = desafio.desafiante.avatar ? desafio.desafiante.avatar : 'default.jpg';
          desafio.desafiante.avatar_img = environment.apiImg + avatar;
          desafio.desafiante.classe_nome = this.classes.find(item => item.id == desafio.desafiante.classe).nome;
          // if (this.placar) {          
          // desafio.vitorias_desafiante = this.placar.find(item => item.desafiante == desafio.desafiante.id && 
          //                                                item.desafio == desafio.id).vitorias_desafiante
          // } else {
          //   desafio.vitorias_desafiante = 0;
          // }
          desafio.pontuacao_desafiante = desafio.pontuacao.filter(item => {
            pontos = item.pontos;
            return item.usuario == desafio.desafiante.id;
          } );
                                                   
        } else {
          desafio.desafiante = <Usuario>{ };
        }      
        if (desafio.desafiado) { 
          let avatar = desafio.desafiado.avatar ? desafio.desafiado.avatar : 'default.jpg';
          desafio.desafiado.avatar_img = environment.apiImg + avatar;
          desafio.desafiado.classe_nome = this.classes.find(item => item.id == desafio.desafiado.classe).nome;
          // if (this.placar) {      
          // desafio.vitorias_desafiado = this.placar.find(item => item.desafiado == desafio.desafiado.id && 
          //                                               item.desafio == desafio.id).vitorias_desafiado;
          // } else {
          //   desafio.vitorias_desafiado = 0;
          // }
          desafio.pontuacao_desafiado = desafio.pontuacao.filter(item => {
            pontos = item.pontos;
            return item.usuario == desafio.desafiado.id
          });
          desafio.mano = { desafiante: 0, desafiado: 0 };
          this.placar.map(item => {
          if ((item.desafiante == desafio.desafiante.id && item.vitorias_desafiante > item.vitorias_desafiado) ||
            (item.desafiado == desafio.desafiante.id && item.vitorias_desafiante < item.vitorias_desafiado)) {
              desafio.mano.desafiante++;
            }
            if ((item.desafiante == desafio.desafiado.id && item.vitorias_desafiado > item.vitorias_desafiante) ||
            (item.desafiado == desafio.desafiado.id && item.vitorias_desafiado < item.vitorias_desafiante)) {
              desafio.mano.desafiado++;
            }
          }
            
          );
          
        } else {         
          desafio.desafiado = <Usuario>{ };         
        }
        //return desafio;
        if (pontos > 0) {
          return desafio;
        }
        return;
      }); 
      this.periodo = this.periodos[0];     
      this.desafiosAll = desafios;
      this.filterPeriodo();
    });
  } 

  private getPlacar() {
    this.resultadoService.getPlacar(0,0,0).subscribe(placar => {
      this.placar = placar;
      this.getDesafios();
    });
  } 
  
}

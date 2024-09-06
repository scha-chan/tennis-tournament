import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Desafio, DesafioPost } from 'src/app/interfaces/desafio';
import { AuthService } from 'src/app/services/auth.service';
import { DesafioService } from 'src/app/services/desafio.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Usuario, UsuarioDesafio } from 'src/app/interfaces/usuario';
import { environment } from 'src/environments/environment';
import { Pontuacao } from 'src/app/interfaces/pontuacao';
import { EmailService } from 'src/app/services/email.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'app-desafio.cadastro',
  templateUrl: './desafio-cadastro.component.html',
  styleUrls: ['../desafio.component.scss']
})
export class DesafioCadastroComponent implements OnInit {

  public desafio: Desafio = <Desafio>{ };
  public id: number;  
  public formDesafio: FormGroup;
  public invalidDate = false;
  public invalidDesafiado = false;
  public usuarios: Usuario[];
  public pontosDesafiante : Pontuacao[] = [];
  public pontosDesafiado : Pontuacao[] = [];
  public partidas = [];
  public desafiante: number;
  public currentUser: Usuario;
  public loading = false;
  public tabIndexDesafiante = [1,3,5];
  public tabIndexDesafiado = [2,4,6];

  constructor(
    private readonly auth: AuthService,
    private readonly desafioService: DesafioService,
    public readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly email : EmailService,
    private readonly layout: LayoutService
  ) { 
    this.activatedRoute.paramMap.subscribe(
      params => {
        this.id = parseInt(params.get('id'));
      }
    );    
  }

  ngOnInit() {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['/resultados']);
    }
    if (this.id) {
      this.geDesafio(this.id.toString());        
    }  else {
      this.getDesafiados();
    }  
    this.formDesafio = new FormGroup({
      desafiado: new FormControl(this.desafio.desafiado, Validators.required),
      dataDesafio: new FormControl(this.desafio.dataDesafio, Validators.required)
    });
    this.currentUser = this.auth.currentUserValue.user;
  }

  public getDesafiados() {
    let week = moment().format('W');
    let year = moment().format('Y');
    if (this.id) {
      this.desafiante = this.desafio.desafiante.id;
    } else {
      this.desafiante = this.auth.currentUserValue.user.id;
    }
    this.desafioService.getDesafiados(this.desafiante.toString(), week, year).subscribe(usuarios => {
      this.usuarios = usuarios.map(usuario => {
        let avatar = usuario.avatar ? usuario.avatar : 'default.jpg';
        usuario.user_img = '<img src="'+environment.apiImg + avatar +'"  alt=""> '+usuario.nome;
        return usuario;
      });     
      this.loading = false;
    });
  }

  public geDesafio(id: string) {
    this.loading = true;
    this.desafioService.getDesafio(id).subscribe(desafio => {
      this.desafio = desafio;      
      let avatar = desafio.desafiante.avatar ? desafio.desafiante.avatar : 'default.jpg';
      desafio.desafiante.user_img = '<img src="'+environment.apiImg + avatar +'"  alt=""> '+desafio.desafiante.nome;
      avatar = desafio.desafiado.avatar ? desafio.desafiado.avatar : 'default.jpg';      
      desafio.desafiado.user_img = '<img src="'+ environment.apiImg + avatar +'" alt=""> '+desafio.desafiado.nome;
      this.desafio.dataDesafio = moment(this.desafio.dataDesafio, 'YYYY-MM-DD HH:mm' ).format('DD/MM/YYYY HH:mm');
      this.pontosDesafiado = desafio.pontuacao.filter(item => item.usuario == desafio.desafiado.id);
      this.pontosDesafiante = desafio.pontuacao.filter(item => item.usuario == desafio.desafiante.id);
      this.partidas = this.pontosDesafiado.map(item => { return item.numero_partida; });
      this.getDesafiados();
    });
  }

  public submitForm() {      
    if (!this.validDesafiante() || !this.validDate()) {                
      return;
    }
    this.loading = true;
    if (this.id) {
      this.desafioService.updateDesafio(this.desafioData()).subscribe(desafio => {
        this.loading = false;
        this.email.sendmailDesafioAtualizado(this.id).subscribe(msg => console.log(msg));
        this.goBack();
      });
      return;
    } 
    this.desafioService.createDesafio(this.desafioData()).subscribe(item => {
      this.loading = false;
      this.email.sendmailUserDesafiado(item.desafio.id).subscribe(msg => console.log(msg));
      this.goBack();
    });   
  }

  private desafioData() : DesafioPost {
    let desafio: DesafioPost = <DesafioPost>{ };
    desafio.desafiado = this.desafio.desafiado.id;
    desafio.observacao = this.desafio.observacao;   
    desafio.dataDesafio = moment(this.desafio.dataDesafio, 'DD/MM/YYYY HH:mm').format('YYYY-MM-DD HH:mm:ss');    
    if (this.id) {
      desafio.id = this.id;
      desafio.desafiante = this.desafio.desafiante.id;
    } else {
      desafio.desafiante = this.desafiante;
    }
    if (this.pontosDesafiado.length && this.pontosDesafiante.length) {
      desafio.pontuacao = [ ...this.pontosDesafiado, ...this.pontosDesafiante];
    }
    return desafio;    
  }

  public validDesafiante() {
    if (!this.desafio.desafiado) {
      this.invalidDesafiado = true;
      return false;
    } 
    this.invalidDesafiado = false;
    return true;
  }

  public validDate() {
    const dataDesafio = moment(this.desafio.dataDesafio, 'DD/MM/YYYY HH:mm');
    if (!dataDesafio.isValid()) {
      this.invalidDate = true;
      return false;
    }
    var data = this.layout.getPeriodo(moment().week(),moment().year());
    if (dataDesafio.isAfter(data.dataFim) || dataDesafio.isBefore(data.dataInicio)) {
      this.invalidDate = true;
      return false;
    }      
    this.invalidDate = false;
    return true;
  }

  public getClass(user: UsuarioDesafio) {  
    console.log(user.id, this.desafio.desafiado.id, user, this.desafio)  ;
    if (this.desafio.desafiado && user.id == this.desafio.desafiado.id) {
      return ' selected ';
    } 
    if (user.ativo  != 1) {
      return ' disabled ';
    }
    if (user.dataDesafio) {
      var dataDesafio = moment(user.dataDesafio, 'YYYY/MM/DD HH:mm:ss');
      var data = this.layout.getPeriodo(moment().week(),moment().year());
      if (dataDesafio.isSameOrAfter(data.dataInicio)) {
        return ' disabled ';
      }      
      var week 
    }
    return '';
  }

  public canSelect(user: Usuario) {    
    if (user.ativo  != 1) {
      return false;
    }
    return true;
  }

  public selecionarDesafiado(user: Usuario) {
    if (this.canSelect(user)) {
      this.desafio.desafiado = user;
    }    
  }

  public goBack() {    
      this.router.navigate(['desafios']);   
  }

}

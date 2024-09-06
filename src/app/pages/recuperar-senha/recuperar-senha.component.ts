import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { SenhaUsuario } from 'src/app/interfaces/usuario';
import { FormGroup } from '@angular/forms/src/model';
import { UsuarioService } from 'src/app/services/usuario.service';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'game-recuperar-senha',
  templateUrl: './recuperar-senha.component.html',
  styleUrls: ['./recuperar-senha.component.scss']
})
export class RecuperarSenhaComponent implements OnInit {

   public token = '';
   public email: string;
   public senhas: SenhaUsuario = <SenhaUsuario>{ };
   public loading = false;
   public form:FormGroup;
   public invalidPassword = false;
   public invalidLengthPassword = false;
   public invalidEmail = false;

  constructor(
    public readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private readonly usuarioService: UsuarioService,
    private readonly layout: LayoutService
  ) { 
    this.activatedRoute.paramMap.subscribe(
      params => {
        if (params.get('token')) {
          this.token = params.get('token');
        }        
      }
    );  
  }

  public get hasCode(): boolean {
    return this.token != '';
  }

  ngOnInit() {}

  public enviarEmail() {
      if (this.email == '') {
        this.invalidEmail = true;
      }
      this.invalidEmail = false;
      this.usuarioService.generatePasswordToken(this.email).subscribe(response => {
        this.layout.openConfirmDialog('Aviso', response, false)
        .then(() => { this.router.navigate(['/']); }, () => {  this.router.navigate(['/']); } );          
      });
  }

  public salvarSenha() {
    if (!this.validPassword()){
      return;
    }
    this.senhas.token = this.token;
    this.usuarioService.updatePassword(this.senhas).subscribe(response => {
      this.layout.openConfirmDialog('Aviso', response, false)
      .then(() => { this.router.navigate(['/']); }, () => {  this.router.navigate(['/']); } );          
    });
  }
  

  public validPassword() {
    if (!this.senhas.password || this.senhas.password.length < 8) {
      this.invalidLengthPassword = true;
      return false;
    }
    this.invalidLengthPassword = false;    
    if (this.senhas.password != this.senhas.password_confirmation || !this.senhas.password_confirmation) {
      this.invalidPassword = true;
      return false;
    }
    this.invalidPassword = false;
    return true;
  }

}

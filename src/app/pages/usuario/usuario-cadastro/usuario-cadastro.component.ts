import { Component, OnInit } from '@angular/core';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario, Situacao, UsuarioForm } from 'src/app/interfaces/usuario';
import { NgForm } from '@angular/forms';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import { Classe } from 'src/app/interfaces/classe';
import * as moment from 'moment';
import { UploadService } from 'src/app/services/upload.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { LayoutService } from 'src/app/services/layout.service';
import { EmailService } from 'src/app/services/email.service';
import { environment } from '../../../../environments/environment';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-usuario.cadastro',
  templateUrl: './usuario-cadastro.component.html',
  styleUrls: ['../usuario.component.scss'],
  providers: [UploadService]

})
export class UsuarioCadastroComponent implements OnInit {

  public usuario: Usuario = <Usuario>{ };
  public id: number;
  public formUsuario: FormGroup;
  public invalidPassword = false;
  public invalidDate = false;
  public classes: Classe[];
  public situacoes: Situacao[];
  public formData: FormData;
  public fileToUpload: File;
  public prevSituacao = -1;
  public loading = false;

  constructor(
    private readonly auth: AuthService,
    private readonly usuarioService: UsuarioService,
    public readonly router: Router,
    private activatedRoute: ActivatedRoute,
    private upload: UploadService,
    private readonly layout : LayoutService,
    private readonly email : EmailService,
    private readonly classeService: ClasseService
  ) {      
    this.activatedRoute.paramMap.subscribe(
      params => {
        this.id = parseInt(params.get('id'));
      }
    );    
  }

  ngOnInit() {
    this.getClasses(); 
    this.situacoes = this.auth.getSituacoes(); 
    if (!this.id && !this.isAdmin && this.auth.currentUserValue) {
      this.router.navigate(['perfil']);
    }
    this.formUsuario = new FormGroup({
      nome: new FormControl(this.usuario.nome, [
        Validators.required,
        Validators.minLength(4)          
      ]),
      email: new FormControl(this.usuario.email, [Validators.required, Validators.email]),
      tipo: new FormControl(this.usuario.tipo, Validators.required),
     });
  }

  public get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  public getClasses() {   
    this.classeService.getClasses().subscribe(classes => {      
     this.classes = classes;  
     if (this.id) {         
      this.getUsuario(this.id.toString());   
     }   
    });
  }

  public getUsuario(id: string) {
    this.usuarioService.getUsuario(id).subscribe(usuario => {
      this.usuario = usuario;
      this.usuario.dataNascimento = this.usuario.dataNascimento ? moment(this.usuario.dataNascimento, 'YYYY-MM-DD' ).format('DD/MM/YYYY') : null;
      this.usuario.avatar_img = environment.apiImg + usuario.avatar;
      if (!this.isAdmin) {
        if (usuario.ativo == 1) {      
          this.situacoes = this.situacoes.filter(item => item.id == 1 || item.id == 3); 
        } else if (usuario.ativo == 3 || usuario.ativo == 4) { 
          this.situacoes = this.situacoes.filter(item =>  item.id == 3 || item.id == 4);
        }     
      }
      this.prevSituacao = usuario.ativo;
    });
  }

  public goBack() {
    if (this.isAdmin) {
      this.router.navigate(['jogadores']);
    } else {
      this.router.navigate(['perfil']);
    }
  }

  public submitForm() {      
      if ((!this.id && !this.validPassword()) || !this.validDate()) {                
        return;
      }
      this.loading = true;
      if (this.id) {
        this.usuarioService.updateUsuario(this.userData()).subscribe(user => {
          if (this.prevSituacao === 2 && (user.ativo * 1) === 1) {
            this.email.sendmailUserAprovado(user.id).subscribe(msg => console.log(msg));
          }    
          if (this.fileToUpload) {
            this.uploadFile();
          } else {             
            this.loading = false;       
            this.layout.openConfirmDialog('Sucesso', 'Cadastro atualizado com sucesso!', false)
            .then(() => { this.goBack(); }, () => { this.goBack(); } );    
          }
        });
        return;
      } 
      this.usuarioService.createUsuario(this.userData()).subscribe(user => {
        this.id = user.id;
        this.email.sendmailNewUser(user.id).subscribe(msg => console.log(msg));
        if (this.fileToUpload) {          
          if (this.isAdmin) {
            this.uploadFile();
          }         
        } else {          
          this.layout.openConfirmDialog('Sucesso', 'Cadastro realizado com sucesso! <br> Você receberá um email quando seu usuário for liberado.', false)
            .then(() => { this.goBack(); }, () => { this.goBack(); } );       
        }
      });
     
  }

  public uploadFile() {
    this.upload.uploadFile(this.id.toString(), this.fileToUpload)
      .subscribe(
        event => {
          if (event.type == HttpEventType.UploadProgress) {
            const percentDone = Math.round(100 * event.loaded / event.total);
            console.log(`File is ${percentDone}% loaded.`);
          } else if (event instanceof HttpResponse) {
            console.log('File is completely loaded!');
          }
        },
        (err) => {
          this.layout.openConfirmDialog('Erro', 'Falha no upload do arquivo.', false);
          console.log("Upload Error:", err);
        }, () => {
          this.loading = false;     
          this.goBack();
          console.log("Upload done");
        }
      )    
  }

  private userFormData() : FormData {
    let formData = new FormData();
    formData.append("nome", this.usuario.nome);
    formData.append('avatar', this.fileToUpload, this.fileToUpload.name);
    //formData.append("avatar", this.formUsuario.get('avatar').value);
    formData.append("email", this.usuario.email);
    formData.append("datanascimento", moment(this.usuario.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD'));
    formData.append("codigo", this.usuario.codigo);
    formData.append("telefone", this.usuario.telefone);
    formData.append("celular", this.usuario.celular);
    formData.append("classe", this.usuario.classe.toString());
    
    formData.append("ativo", this.usuario.ativo.toString());
    if (this.id) {
      formData.append("id", this.id.toString());
    }
    if (this.isAdmin) {
      formData.append("tipo", this.usuario.tipo);   
    }
    if (!this.id) {
      formData.append("password", this.usuario.password);
      formData.append("password_confirmation", this.usuario.password_confirmation);
    }  
    return formData;
  }

  private userData() : Usuario {
    let user: Usuario = <Usuario>{ };
    user.nome = this.usuario.nome;
    user.email = this.usuario.email;
    user.classe = this.usuario.classe;
    if (this.usuario.dataNascimento) {
      user.dataNascimento = moment(this.usuario.dataNascimento, 'DD/MM/YYYY').format('YYYY-MM-DD');
    } else {
      user.dataNascimento = null;
    }    
    user.celular = this.usuario.celular;   
    user.telefone = this.usuario.telefone;   
    user.ativo = this.usuario.ativo;
    if (this.id) {
      user.id = this.id;     
    }
    user.tipo = this.usuario.tipo; 
    if (!this.id && !this.isAdmin) {
      user.tipo = 'J';
    }          
    if (!this.id) {
      user.password = this.usuario.password;
      user.password_confirmation = this.usuario.password_confirmation;
    }      
    return user;    
  }

  public onFileSelect(files: FileList) {
    this.fileToUpload = files.item(0); 
  }

  public validDate() {
    if (!this.usuario.dataNascimento) {
      return true;
    }
    const data = moment(this.usuario.dataNascimento, 'DD/MM/YYYY');
    if (!data.isValid()) {
      this.invalidDate = true;
      return false;
    }
    this.invalidDate = false;
    return true;
  }

  public validPassword() {
    if (this.usuario.password != this.usuario.password_confirmation || !this.usuario.password || !this.usuario.password_confirmation) {
      this.invalidPassword = true;
      return false;
    }
    this.invalidPassword = false;
    return true;
  }
}

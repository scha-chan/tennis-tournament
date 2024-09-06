import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario, Situacao } from 'src/app/interfaces/usuario';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { TableHeader, TableFilter } from 'src/app/interfaces/table';
import { CustomAdapter, CustomDateParserFormatter } from 'src/app/services/data.service';
import { NgbCalendar, NgbDateParserFormatter, NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { Classe } from 'src/app/interfaces/classe';
import { environment } from '../../../environments/environment';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.scss'],
  providers: [
    {provide: NgbDateAdapter, useClass: CustomAdapter},
    {provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter}
  ]
})
export class UsuarioComponent implements OnInit {

  public usuarios: Usuario[] = [];
  public usuariosPaginated: Usuario[] = [];
  public tableHeader: TableHeader[];
  public tableFilter: TableFilter[];
  public usuario: Usuario;
  public limit = 25;
  public page = 1;
  public classes: Classe[];
  public situacoes: Situacao[];
  public filter = { situacao: -1, classe: 0, usuario: '' }

  constructor(
    private readonly auth: AuthService,
    private readonly usuarioService: UsuarioService,
    private readonly router: Router,
    private readonly layout: LayoutService,
    private ngbCalendar: NgbCalendar, 
    private readonly classeService: ClasseService,
    private dateAdapter: NgbDateAdapter<string>
  ) { }

  ngOnInit() {
     if (this.isAdmin) {
        this.getClasses(); 
        this.situacoes = this.auth.getSituacoes();  
        this.tableHeader = [
          { nome: 'Avatar', alias: 'avatar_img', sortable: true },
          { nome: 'Nome', alias: 'nome', sortable: true },
          { nome: 'Email', alias: 'email', sortable: true },
          { nome: 'Data Nascimento', alias: 'dataNascimento', sortable: true, isDate: true, nowrap: true },
          { nome: 'Telefone', alias: 'telefone', sortable: true, mask: '(00) 0000-0000', nowrap: true },
          { nome: 'Celular', alias: 'celular', sortable: true,  mask: '(00) 00000-0000', nowrap: true },
          { nome: 'Tipo', alias: 'tipo_nome', sortable: true },
          { nome: 'Situação', alias: 'ativo_nome', sortable: true },
          { nome: '', alias: 'editar', sortable: false, isButton: true, class:'btn-success' },
          { nome: '', alias: 'remover', sortable: false, isButton: true, class:'btn-danger' }       
        ];
     } else {
       if (this.auth.currentUserValue) {
        const state = this.router.routerState;
        this.router.navigate(['/perfil']);
       } else {
        this.router.navigate(['/']);
       }     
     }
  }

  public get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  public getClasses() {   
    this.classeService.getClasses().subscribe(classes => {      
     this.classes = classes;     
     this.getUsuarios();
    });
  }

  public getUsuarios() {
    this.usuarioService.getUsuarios().subscribe(usuarios => {      
      this.usuarios = usuarios.map(user => {
        user.classe_nome = this.classes.find(item => item.id === user.classe).nome;
        user.ativo_nome = this.situacoes.find(item => item.id === user.ativo).nome;
        user.tipo_nome = user.tipo == 'J' ? 'Jogador' : 'Administrador';
        user.avatar_img = user.avatar ? '<img src="' + environment.apiImg + user.avatar + '" alt="">' : '';
        return user;
      });      
      this.paginate(1);
    } );
  }

  public deleteUsuario(id: number) {   
    this.usuarioService.deleteUsuario(id.toString()).subscribe(response => {
      this.usuarios = this.usuarios.filter(item => item.id !== id);
      this.layout.openConfirmDialog('Sucesso', 'Usuário removido com sucesso!', false);
      this.paginate(1);
    });
  }

  public editUsuario(id: number) {
    this.router.navigate(['jogador/cadastro/'+id]);
  }

  public adicionarUsuario() {
    this.router.navigate(['jogador/cadastro']);
  }

  public toogleStatus(usuario: Usuario) {
    usuario.ativo = usuario.ativo ? 0 : 1;
    this.usuarioService.updateUsuario(usuario).subscribe(user => {
    this.usuarios = this.usuarios.map(item => (item.id == usuario.id) ? item = usuario : item);
      this.paginate(this.page);
    });
  }

  public sortTable(item: TableHeader) {
    const index = this.tableHeader.findIndex((obj => obj.alias == item.alias));
    const sort = !item.sort ? 'asc' : item.sort == 'desc' ? 'asc' : 'desc';
    if (sort == 'asc') {
      this.usuarios.sort((one, two) => (one[item.alias] < two[item.alias] ? -1 : 1));
    } else {
      this.usuarios.sort((one, two) => (one[item.alias] > two[item.alias] ? -1 : 1));
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

  public clickTable(event) {
      if (event.header.alias == 'editar') {
        this.editUsuario(event.row.id);
        return;
      }
      if (event.header.alias == 'remover') {
        if (this.auth.currentUserValue.user.id == event.row.id) {
          this.layout.openConfirmDialog('Aviso','Não é permitido remover o usuário logado!', false); 
          return;
        }
        this.usuario = event.row;
        this.layout.openConfirmDialog('Aviso','Você realmente deseja remover esse usuário?', true)
        .then(() => { this.deleteUsuario(event.row.id) }, () => { } );       
        return;
      }
      if (event.header.alias == 'ativo') {
        this.toogleStatus(event.row);
        return;
      }
      
  }

  public filtrar() {
    this.usuariosPaginated = this.usuarios.filter((user, index) => 
      (this.filter.usuario == '' || user.nome.toLowerCase().indexOf(this.filter.usuario.toLowerCase()) != -1) &&
      (this.filter.situacao == -1 || (this.filter.situacao >= 0 && user.ativo == this.filter.situacao)) &&
      (this.filter.classe == 0 || (this.filter.classe > 0 && user.classe == this.filter.classe)) 
    );
    this.usuariosPaginated = this.usuariosPaginated.filter((user, index) => index < (this.limit * this.page));
  }

  public paginate(page: number) {
    this.page = page;
    this.filtrar();
    //this.usuariosPaginated = this.usuarios.filter((user, index) => index < (this.limit * page));
  }

}

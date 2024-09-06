import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/interfaces/usuario';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/services/layout.service';
import { TableHeader, TableFilter } from 'src/app/interfaces/table';
import { CurrentUser } from 'src/app/interfaces/currentUser';
import { Classe } from 'src/app/interfaces/classe';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-classe',
  templateUrl: './classe.component.html',
  styleUrls: ['./classe.component.scss']
})
export class ClasseComponent implements OnInit {

  public classes: Classe[] = [];
  public classesPaginated: Classe[] = [];
  public tableHeader: TableHeader[];
  public classe: Classe;
  public limit = 25;
  public page = 1;

  constructor(
    private readonly auth: AuthService,
    private readonly classeService: ClasseService,
    private readonly router: Router,
    private readonly layout: LayoutService
  ) { }

  ngOnInit() {
    this.getClasses();
    this.tableHeader = [
      { nome: 'Prioridade', alias: 'ordem', sortable: true }  ,   
      { nome: 'Nome', alias: 'nome', sortable: true },
      { nome: '', alias: 'editar', sortable: false, isButton: true, class:'btn-success' },
      { nome: '', alias: 'remover', sortable: false, isButton: true, class:'btn-danger' }              
    ];     
  }

  public get isAdmin(): boolean {
    return this.auth.isAdmin();
  }

  public getClasses() {   
    this.classeService.getClasses().subscribe(classes => {      
     this.classes = classes;
     this.paginate(1); 
    });    
  }

  public deleteClasse(id: number) {   
    this.classeService.deleteClasse(id.toString()).subscribe(response => {
      this.classes = this.classes.filter(item => item.id !== id);  
      this.paginate(1); 
      this.layout.openConfirmDialog('Sucesso', 'A classe foi removida com sucesso!', false);
    });
  }

  public confirmDelete(confirm, item) {
    if (confirm){
      this.deleteClasse(item.id);
    }    
  }

  public editClasse(id: number) {
    this.router.navigate(['classe/cadastro/'+id]);
  }

  public addClasse() {
    this.router.navigate(['classe/cadastro']);
  }

  public sortTable(item: TableHeader) {
    const index = this.tableHeader.findIndex((obj => obj.alias == item.alias));
    const sort = !item.sort ? 'asc' : item.sort == 'desc' ? 'asc' : 'desc';
    if (sort == 'asc') {
      this.classes.sort((one, two) => (one[item.alias] < two[item.alias] ? -1 : 1));
    } else {
      this.classes.sort((one, two) => (one[item.alias] > two[item.alias] ? -1 : 1));
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
        this.editClasse(event.row.id);
        return;
      }
      if (event.header.alias == 'remover') {
        this.classe = event.row;
        this.layout.openConfirmDialog('Aviso','Você realmente deseja remover essa classe?', true)
        .then(() => { this.deleteClasse(event.row.id) }, () => { } );            
        return;
      }     
      
  }

  public paginate(page: number) {
    this.page = page;
    this.classesPaginated = this.classes.filter((user, index) => index < (this.limit * page));
  }

}

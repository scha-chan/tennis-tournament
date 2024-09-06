import { Component, OnInit } from '@angular/core';
import * as moment from 'moment';
import { Desafio } from 'src/app/interfaces/desafio';
import { AuthService } from 'src/app/services/auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Classe } from 'src/app/interfaces/classe';
import { ClasseService } from 'src/app/services/classe.service';

@Component({
  selector: 'app-classe.cadastro',
  templateUrl: './classe-cadastro.component.html',
  styleUrls: ['../classe.component.scss']
})
export class ClasseCadastroComponent implements OnInit {

  public classe: Classe = <Classe>{ };
  public classes: Classe[];
  public id: number;  
  public formClasse: FormGroup;
  public invalidDate = false;

  constructor(
    private readonly auth: AuthService,
    private readonly classeService: ClasseService,
    public readonly router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    this.activatedRoute.paramMap.subscribe(
      params => {
        this.id = parseInt(params.get('id'));
      }
    );    
  }

  ngOnInit() {
    this.getClasse();
    if (this.id) {
      this.getClasse();        
    } else {
      this.classe.ordem = this.classes[this.classes.length - 1].ordem + 1;
    } 
    this.formClasse = new FormGroup({
      nome: new FormControl(this.classe.nome, [
        Validators.required,
        Validators.minLength(3)          
      ]),
      ordem: new FormControl(this.classe.ordem, Validators.required)
    });
  }

  public getClasse() {    
    this.classeService.getClasses().subscribe(classes => {      
      this.classes = classes;
      this.classe = this.classes.find(item => item.id == this.id);
     }); 
  }

  public submitForm() { 
    if (this.id) {
      this.classeService.updateClasse(this.classeData()).subscribe(classe => {
        this.classes =  this.classes.map(item => {
          if(item.id == this.id) {
             item = classe;
          }
          return item;
        } );
        this.auth.setClasses(this.classes);
        this.goBack();
      });
      return;
    } 
    this.classeService.createClasse(this.classeData()).subscribe(classe => {
      this.classes.push(classe);
      this.auth.setClasses(this.classes);
      this.goBack();
    });   
  }

  private classeData() : Classe {
    let classe: Classe = <Classe>{ };
    classe.nome = this.classe.nome;
    classe.ordem = this.classe.ordem;       
    if (this.id) {
      classe.id = this.id;     
    }    
    return classe;    
  }

  public goBack() {    
    this.router.navigate(['classes']);   
  }
}

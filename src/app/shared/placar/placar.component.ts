import { Component, OnInit, Input, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Desafio } from 'src/app/interfaces/desafio';
import * as moment from 'moment';
import { Usuario } from 'src/app/interfaces/usuario';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'game-placar',
  templateUrl: './placar.component.html',
  styleUrls: ['./placar.component.scss']
})
export class PlacarComponent implements OnInit {  

  @Input() public  desafio: Desafio;
  @Input() public  edit: false;
  public diaSemana: string;
  public dia: number;
  public mes: string ;
  public ano: number;
  public time: string;
  @Output() action: EventEmitter<any> = new EventEmitter();

  constructor(
    private cdRef:ChangeDetectorRef,
    private readonly layout: LayoutService
  ) { }

  ngOnInit() {
    if (this.desafio) {
      let data = moment(this.desafio.dataDesafio, 'DD/MM/YYYY HH:mm');
      this.diaSemana = this.layout.getDayOfWeekName(data.format('e'));
      this.dia = parseInt(data.format('DD'));
      this.ano = data.year();
      this.time = data.format('HH:mm');
      this.mes = this.layout.getMonthAbreviado(data.month());
    }
  }

  ngAfterViewChecked()
  {    
    this.cdRef.detectChanges();
  }

  public clickElement(action) {
    this.action.emit({action, 'item': this.desafio});
  }

}

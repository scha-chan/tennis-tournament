import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';
import * as moment from 'moment';
import { Periodo } from 'src/app/interfaces/ranking';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  constructor(
    private modalService: NgbModal
  ) { }

  public openConfirmDialog(title: string, content: string, showButtonCancel?: boolean) {
    const modalRef = this.modalService.open(ConfirmDialogComponent, {backdrop: 'static', keyboard: false, centered: true});
    modalRef.componentInstance.title = title;
    modalRef.componentInstance.content = content;   
    if (!showButtonCancel) {
      modalRef.componentInstance.showButtonCancel = showButtonCancel;
    }   
    return  modalRef.result;   
  }    

  public getAtualWeek()  {
    let year = moment().year()
    let week = moment().week();
      if (parseInt(moment('1-1-'+ year, 'DD-MM-YYYY').format('e')) > 0) {
        week--;
      }    
    return { week, year }
  }

  public getPeriodo(week: number, year: number) : Periodo {
    if (parseInt(moment('1-1-'+year, 'DD-MM-YYYY').format('e')) > 0) {
      week--;
    }
    var dataInicio = moment('1-1-'+year, 'DD-MM-YYYY').add(week, 'weeks').startOf('isoWeek');
    var dataFim = moment('1-1-'+year, 'DD-MM-YYYY').add(week, 'weeks').endOf('isoWeek');
    return { semana: week, ano: year, dataInicio, dataFim }
  }

  public getDayOfWeekName(code: string) {
    const daysOfWeek = ['SEG','TER','QUA','QUI','SEX','SAB','DOM'];
    return daysOfWeek[code];
  }

  public getMonthName(code: number) {
    const names = ['JANEIRO','FEVEREIRO','MARÇO','ABRIL','MAIO','JUNHO','JULHO','AGOSTO','SETEMBRO','OUTUBRO','NOVEMBRO','DEZEMBRO'];
    return names[code];
  }

  public getMonthAbreviado(code: number) {
    const names = ['JAN','FEV','MAR','ABR','MAI','JUN','JUL','AGO','SET','OUT','NOV','DEZ'];
    return names[code];
  }

  public setPeriodo(data, array) {
    let intervalo = this.getPeriodo(data.isoWeek(), data.year());
    if (!array || !array.find(item => item.dataInicio.isSame(intervalo.dataInicio))) {
      array.push(intervalo);
    }  
    return array;   
  }
}

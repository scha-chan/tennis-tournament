import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TableHeader, TableFilter } from 'src/app/interfaces/table';
import * as moment from 'moment';
import { OnChanges, SimpleChanges } from '@angular/core/src/metadata/lifecycle_hooks';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'game-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']    
})
export class TableComponent implements OnInit, OnChanges  {

  @Input() public header: TableHeader[] = [];
  @Input() public rows = []; 
  @Output() action: EventEmitter<any> = new EventEmitter();
  @Output() sort: EventEmitter<any> = new EventEmitter();

  constructor(private cdRef:ChangeDetectorRef) { }

  ngOnInit() {

  }

  ngOnChanges(changes: SimpleChanges) {  
  }

  ngAfterViewChecked()
  {
    this.cdRef.detectChanges();
  }

  public get hasRegistros() {
    return this.rows && this.header && this.rows.length && this.header.length
  }

  public sortTable(item: TableHeader) {
    if (!item.sortable) {
      return '';
    }
    this.sort.emit(item);
  }

  public clickElement(header: TableHeader, row) {
    this.action.emit({header, row});
  }

  public getText(head: TableHeader, row) {
    if (head.isDate) {
      const date = moment(row[head.alias],'YYYY-MM-DD');
      if (date.isValid()) {
        return date.format('DD/MM/YYYY');
      }
      return row[head.alias];      
    }
    if (head.isDateTime) {
      const date = moment(row[head.alias],'YYYY-MM-DD HH:mm:ss');
      if (date.isValid()) {
        return date.format('DD/MM/YYYY HH:mm');
      }
      return row[head.alias];      
    }
    if (!head.isButton && !head.isCheckbox && !head.mask) {
      return this.convertToText(row, head.alias);
    }
    return '';
  }

  public convertToText(row, alias) {
    if (alias.indexOf('.')) {
      alias = alias.split('.'); 
      let texto = row[alias[0]];
      for (var i = 1; i < alias.length; i++) {
        texto = texto[alias[i]];
      }    
      return texto;
    }
    return row[alias];
  }

  public loadIcon(head: TableHeader) { 
    if (head.isCheckbox || head.isButton) {
      return 'is-btn';
    }    
    let icone = '';
    if (head.nowrap) {
      icone += ' text-nowrap ';
    }    
    if (!head.sortable) {
      return icone;
    }
    return 'icon '+ icone + (head.sort ? head.sort : '');
  }

  public classTable(head: TableHeader) {
    let icone = '';
    if (head.nowrap) {
      icone += ' text-nowrap ';
    }
    if (head.isCheckbox || head.isButton) {
      icone += ' is-btn ';
    } 
    return icone;
  }
}

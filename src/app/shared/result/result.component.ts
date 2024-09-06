import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { Desafio } from 'src/app/interfaces/desafio';
import { LayoutService } from 'src/app/services/layout.service';

@Component({
  selector: 'game-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit {  

  @Input() public  desafio: Desafio;

  constructor(
    private cdRef:ChangeDetectorRef,
    private readonly layout: LayoutService
  ) { }

  ngOnInit() {
  }

  ngAfterViewChecked()
  {    
    this.cdRef.detectChanges();
  }

}

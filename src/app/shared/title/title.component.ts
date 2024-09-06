import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'game-title',
  templateUrl: './title.component.html',
  styleUrls: ['./title.component.scss']
})
export class TitleComponent implements OnInit {

  @Input() public title: string;
  @Input() public rota = '';
  @Input() public btnText = '';

  constructor(
    private readonly router: Router
  ) { }

  ngOnInit() {
  }

  public adicionar() {
    this.router.navigate([this.rota]);
  }

}

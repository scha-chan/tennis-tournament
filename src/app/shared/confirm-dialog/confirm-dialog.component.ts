import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'game-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent {

  @Input() public title = 'Aviso';
  @Input() public content = 'Você realmente deseja fazer essa ação?';
  @Input() public buttonOk = 'Ok';
  @Input() public showButtonCancel = true;  
  //@Output() confirm: EventEmitter<any> = new EventEmitter();

  constructor(public modal: NgbActiveModal) {}

  public dismiss() {
    //this.confirm.emit(false);
    this.modal.dismiss(false);
  }

  public accept() {
   // this.confirm.emit(true);
    this.modal.close(true);
  }

}

import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'game-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {

  @Input() public total = 0; 
  @Input() public limit = 25; 
  @Input() public page = 1; 
  @Output() callback: EventEmitter<any> = new EventEmitter();

  public pages = 0;

  constructor(private cdRef:ChangeDetectorRef) { }

  ngOnInit() {
    
  }

  ngAfterViewChecked() {
    this.pages =  Math.ceil(this.total / this.limit);
    this.cdRef.detectChanges();
  }

  public get hideLoadMore()  {
    return !(this.page >= this.pages);
  }

  public get hideLoadLess()  {
    return !(this.page <= 1);
  }

  public get hidePagination() {
    return !(this.total <= this.limit);
  }

  loadMore() {
    this.page++;
    this.callback.emit(this.page);
  }
  
  loadLess() {
    this.page--;
    this.callback.emit(this.page);
  }

}

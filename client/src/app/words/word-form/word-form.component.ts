import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss']
})
export class WordFormComponent implements OnInit,OnChanges {

  @Output() form = new EventEmitter();
  @Output() removeForm = new EventEmitter();
  @Input() cleared = false;
  @Input() wordForm = '';


  added = false;
  err = false;


  constructor() { }
  ngOnChanges(changes: SimpleChanges): void {
    if(changes.cleared.currentValue === true){
      this.wordForm = '';
      this.added = false;
    }
  }

  ngOnInit(): void {
  }
  add() {
    if(this.wordForm && this.wordForm.length > 0) {
      this.form.emit(this.wordForm);
      console.log(this.wordForm);

      this.added = true;
      this.err=false;
    }
    else {this.err = true;}
  }
  remove(){
    this.removeForm.emit();
  }
}

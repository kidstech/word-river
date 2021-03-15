import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss']
})
export class WordFormComponent implements OnInit {

  @Output() form = new EventEmitter();
  wordForm = '';


  constructor() { }

  ngOnInit(): void {
  }
  add() {
    if(this.wordForm && this.wordForm.length > 0) {this.form.emit(this.wordForm);}
  }
}

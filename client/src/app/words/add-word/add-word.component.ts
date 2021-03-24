import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {
  @Output() addWord = new EventEmitter();

  forms = [];
  wordName = '';
  finished = false;
  type: string;

  added = false;

  valid: boolean;


  constructor() { }

  check() {
    if (this.wordName && this.type) {
      this.finished =
        this.wordName.length > 1 && this.type.length > 1;
      console.log(this.wordName.length);
    }
    return this.finished;
  }

  ngOnInit(): void {
  }
  add(val) {
    if (!this.added) {
      this.forms.push('');
      this.added = true;
    }
    else { this.forms.push(val); }
  }

  save() {
    this.addWord.emit({name:this.wordName,forms: this.forms.slice(1),type: this.type});
    console.log(this.forms + this.wordName + this.type);
    this.wordName = '';
    this.forms = [];
    this.added = false;
    this.finished = false;
  }
}

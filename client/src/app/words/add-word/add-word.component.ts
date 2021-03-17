import { FnParam } from '@angular/compiler/src/output/output_ast';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Word } from 'src/app/datatypes/word';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {
  @Output() addWord = new EventEmitter();

  forms = [''];
  wordName = '';
  finished = true;
  type: string;

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
    if (this.forms.length === 1 && this.forms[0] === '') {
      this.forms = [];
    }
    this.forms.push(val);
    console.log(this.forms);
  }

  save() {
    this.addWord.emit(new Word(this.wordName, this.forms, this.type || undefined));
  }
}

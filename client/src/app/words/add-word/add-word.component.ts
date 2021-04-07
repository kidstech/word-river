
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { DictionaryService } from './../../services/dictionary-service/dictionary.service';


@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {
  @Output() addWord = new EventEmitter();
  @Input() words = [];

  forms = [''];
  counter=[''];
  wordName = '';
  finished = false;
  type: string;
  cleared = false;
  suggested = '';

  added = false;

  valid: boolean;


  constructor(private dictionary: DictionaryService) { }

  check() {
    if (this.wordName && this.type) {
      this.finished =
        this.wordName.length > 1 &&
        this.wordName.length <= 60 &&
        this.type.length > 1     &&
        !this.words.some(word =>
          word.word === this.wordName &&
          word.forms === [this.wordName, ...this.forms.filter(e => e.length !== 0)]
        );
      console.log(this.wordName.length);
    }
    return this.finished;
  }

  ngOnInit(): void {
  }

  add(val) {
    // if(this.forms.length === 1 && this.forms[0]===''){
    //   this.forms = [];
    // }
    this.forms[this.forms.length - 1] = val;
    this.forms.push('');
    this.counter.push(val);
    console.log(this.forms);

    this.cleared = false;
  }

  removeForm(i: number) {
    console.log(i);
    this.forms.splice(i, 1);
    this.counter.splice(i, 1);
    console.log(this.forms);
    if (this.forms.length === 0) { this.forms = ['']; }


  }

  suggest() {
    const typed = this.wordName;
    setTimeout(() => {
      if (this.wordName && typed === this.wordName) {
        this.dictionary.getType(this.wordName, type => {
          console.log('Retrieved type from API: ' + type);
          if (type === 'adjective' || type === 'verb' || type === 'noun') {
            this.type = `${type}s`;
            this.suggested = type;
          } else {
            this.type = 'misc';
            this.suggested = 'misc';
          }
          this.check();
        }, err => console.log(err)
        );
      }
    }, 1000);
  }

  save() {
    this.addWord.emit({
      name: this.wordName,
      forms: [...new Set([this.wordName, ...this.forms.filter(e => e.length !== 0)])],// This line removes repetitions and inserts main word
      type: this.type
    });
    console.log(this.forms + this.wordName + this.type);
    this.wordName = '';
    this.forms = [''];
    this.counter = [''];
    this.added = false;
    this.finished = false;
    this.cleared = true;
  }
}

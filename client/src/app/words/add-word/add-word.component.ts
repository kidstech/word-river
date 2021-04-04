import { DictionaryService } from './../../services/dictionary-service/dictionary.service';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {
  @Output() addWord = new EventEmitter();

  forms = [''];
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
        this.wordName.length > 1 && this.type.length > 1;
      console.log(this.wordName.length);
    }
    return this.finished;
  }

  ngOnInit(): void {
  }

  add(val) {
    this.forms.push(val);
    this.cleared = false;
  }

  removeForm(i: number) {
    console.log(i);
    this.forms.splice(i, 1);
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
            this.check();
          } else { this.type = 'misc'; }
        }, err => console.log(err)
        );
      }
    }, 1000);
  }

  save() {
    this.addWord.emit({ name: this.wordName, forms: this.forms.filter(e => e.length !== 0), type: this.type });
    console.log(this.forms + this.wordName + this.type);
    this.wordName = '';
    this.forms = [''];
    this.added = false;
    this.finished = false;
    this.cleared = true;
  }
}

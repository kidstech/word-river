import { Component, OnChanges, OnInit } from '@angular/core';
import { Word } from 'src/app/datatypes/word';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { WordList } from 'src/app/datatypes/wordlist';
import { WordListService } from 'src/app/services/wordlist.service';

@Component({
  selector: 'app-add-wordlist',
  templateUrl: './add-wordlist.component.html',
  styleUrls: ['./add-wordlist.component.scss']
})
export class AddWordListComponent implements OnInit, OnChanges {
  forms = [''];
  wordList: WordList;
  wordlistname = '';
  wordType = '';
  finished = true;

  words: Word[] = [];
  enabled = true;

  constructor(private route: ActivatedRoute, private service: WordListService) { }

  ngOnChanges(): void {
    this.check();
  }

  add(val) {
    this.words.push(val);
   }

  check() {
    this.finished =
      this.wordlistname.length > 1;
    console.log(this.wordlistname.length);

    return this.finished;
  }

  ngOnInit() {
  }

  save() {
    if(this.check()){
      this.service.addWordList(this.wordList);
    }
  }

  enable(val) {
    this.enabled = val;
  }

  addWord(word){
    const type: string = word.type === 'Noun' ? 'noun' : 'Verb' ? 'verb' : 'Adjective' ? 'adjective' :'misc';
    this.wordList[type].push(new Word(word.name,word.forms));
    console.log(this.wordList);
  }
}

import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/datatypes/word';
import { ActivatedRoute, Router } from '@angular/router';
import { WordList } from 'src/app/datatypes/wordlist';
import { WordListService } from 'src/app/services/wordlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DictionaryService } from 'src/app/services/dictionary-service/dictionary.service';

@Component({
  selector: 'app-add-wordlist',
  templateUrl: './add-wordlist.component.html',
  styleUrls: ['./add-wordlist.component.scss']
})
export class AddWordListComponent implements OnInit {
  forms = [''];
  wordList: WordList = { name: '', enabled: false, nouns: [], verbs: [], adjectives: [], misc: [] };
  wordlistname = '';
  wordType = '';
  finished = false;
  id: string;
  wordCount: number;
  types: string[];

  words: Word[] = [];
  enabled = true;
  title: string;

  constructor(
    private route: ActivatedRoute, private service: WordListService,
    private dictService: DictionaryService, private router: Router, public snackBar: MatSnackBar
  ) { }


  add(val) {
    this.words.push(val);
  }

  check() {
    this.finished =
      this.wordlistname.trim().length > 1 && (this.wordlistname.trim().match(/[^-a-zA-Z0-9 ]/)) === null;
    return this.finished;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
    });
  }

  save() {
    if (this.wordList.name !== null) {
      this.wordList.name = this.wordlistname.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').trim();
    }
    this.wordList.enabled = this.enabled;
     this.service.addWordList(this.wordList, this.id).subscribe(
       res => {
         console.log('HTTP RESPONSE', res);
         this.router.navigate(['packs/', this.id]);
              },
       err => {
        console.log(err);
        this.title = err.error.title;
        if(this.title === 'The word list already exists in the context pack'){
          this.snackBar.open('There is already a Word List with the name ' + this.wordList.name + ' in the context pack', 'OK', {
          duration: 90000,
      });
     }
       else {
        this.snackBar.open('Failed to add the word list', 'OK', {
        duration: 90000,
     });
    };
   });
  }

  enable(val: boolean) {
    this.enabled = val;
  }

  addWord(word){
    const type: string = word.type;
    this.wordList[type].push({word:word.name,forms:word.forms});
    // 7/23/21 added contextPackId (the mongo object ID of the context pack this word is a part of)
    this.words.push({word:word.name,forms:word.forms,type});
    return word.type;
  }


  matches(i: Word,w: Word): boolean{
    return i.word === w.word && i.forms === w.forms;
  }

  deleteWord(i: number) {
    const x = this.words[i];
    this.wordList.nouns = this.wordList.nouns.filter(e => !this.matches(e,x));
    this.wordList.verbs = this.wordList.verbs.filter(e => !this.matches(e,x));
    this.wordList.adjectives = this.wordList.adjectives.filter(e => !this.matches(e,x));
    this.wordList.misc = this.wordList.misc.filter(e => !this.matches(e,x));
    this.words.splice(i, 1);
    this.types.splice(i, 1);
  }


}

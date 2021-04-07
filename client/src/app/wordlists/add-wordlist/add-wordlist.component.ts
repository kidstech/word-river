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
  status: string;

  constructor(
    private route: ActivatedRoute, private service: WordListService,
    private dictService: DictionaryService, private router: Router, public snackBar: MatSnackBar
  ) { }


  add(val) {
    this.words.push(val);
    console.log(this.words);

  }

  check() {
    this.finished =
      this.wordlistname.trim().length > 1 && (this.wordlistname.trim().match(/[^-a-zA-Z0-9 ]/)) === null;
    console.log(this.wordlistname.length);
    console.log(this.wordlistname.match(/[^-a-zA-Z0-9 ]/));
    return this.finished;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
    });
    this.dictService.getType('run', type => console.log(type), error=>{
    }); // temporary spot to test
  }

  save() {
    if (this.wordList.name !== null) {
      this.wordList.name = this.wordlistname.replace(/([\uE000-\uF8FF]|\uD83C[\uDF00-\uDFFF]|\uD83D[\uDC00-\uDDFF])/g, '').trim();
    }
    this.wordList.enabled = this.enabled;
    console.log(this.wordList);
     this.service.addWordList(this.wordList, this.id).subscribe(
       res => {
         console.log('HTTP RESPONSE', res);
         this.router.navigate(['packs/', this.id]);
              },
       err => {
        console.log(err);
        this.status = err.statusText;
        if(this.status === 'Bad Request'){
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
    this.words.push({word:word.name,forms:word.forms,type});
    console.log(this.words);
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

import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/datatypes/word';
import { ActivatedRoute, Router } from '@angular/router';
import { WordList } from 'src/app/datatypes/wordlist';
import { WordListService } from 'src/app/services/wordlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-add-wordlist',
  templateUrl: './add-wordlist.component.html',
  styleUrls: ['./add-wordlist.component.scss']
})
export class AddWordListComponent implements OnInit {
  forms = [''];
  wordList: WordList = {name:'',enabled:false,nouns:[],verbs:[],adjectives:[],misc:[]};
  wordlistname = '';
  wordType = '';
  finished = false;
  id: string;
  valid = true;

  words: Word[] = [];
  enabled = true;

  constructor(private route: ActivatedRoute, private service: WordListService,private router: Router, private snackBar: MatSnackBar) { }

  add(val) {
    this.words.push(val);
    console.log(this.words);

   }

  check() {
    this.finished =
      this.wordlistname.length > 1;
    console.log(this.wordlistname.length);

    return this.finished;
  }

  ngOnInit() {
    this.route.paramMap.subscribe((pmap) => {
      this.id =  pmap.get('id');
    });
  }

  save() {
    this.wordList.name = this.wordlistname;
    this.wordList.enabled = this.enabled;
    console.log(this.wordList);
     this.service.addWordList(this.wordList, this.id).subscribe(
       res => {
         console.log('HTTP RESPONSE', res);
         this.router.navigate(['packs/', this.id]);
              },
       err => {
        console.log(err);
        this.valid = false;
        console.log(this.valid);
        this.snackBar.open('There is already a Word List with the name ' + this.wordList.name + ' in the context pack', 'OK', {
        duration: 90000,
      });
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


}

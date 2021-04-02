import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/datatypes/word';
import { ActivatedRoute, Router } from '@angular/router';
import { WordList } from 'src/app/datatypes/wordlist';
import { WordListService } from 'src/app/services/wordlist.service';
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

  words: Word[] = [];
  enabled = true;

  constructor(
    private route: ActivatedRoute, private service: WordListService,
    private dictService: DictionaryService, private router: Router
  ) { }

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
      this.id = pmap.get('id');
    });
    this.dictService.getType('run', type => console.log(type), error=>{
    }); // temporary spot to test
  }

  save() {
    this.wordList.name = this.wordlistname;
    this.wordList.enabled = this.enabled;
    console.log(this.wordList);
    this.service.addWordList(this.wordList, this.id).subscribe();
    this.router.navigate(['packs', this.id]);
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

import { WordList } from './../../datatypes/wordlist';
import { Subscription } from 'rxjs';
import { WordListService } from 'src/app/services/wordlist.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Word } from 'src/app/datatypes/word';

@Component({
  selector: 'app-view-wordlist',
  templateUrl: './view-wordlist.component.html',
  styleUrls: ['./view-wordlist.component.scss']
})
export class ViewWordlistComponent implements OnInit {

  id: string;
  name = '';
  enabled: boolean;
  wordlist: WordList;
  originalName: string;
  words;
  types: string[];
  getUserSub: Subscription;

  constructor(private route: ActivatedRoute, private service: WordListService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.name = pmap ? pmap.get('name') : '';
      this.id = pmap ? pmap.get('id') : '';
      this.loadWords();
    });
  }

  addWord(word) {
    console.log(this.wordlist);
    this.wordlist[word.type].unshift({ word: word.name, forms: word.forms });
    this.words.unshift({ word: word.name, forms: word.forms,type: word.type});
    this.types = this.refreshTypes(this.words);
  }

  loadWords() {
    this.getUserSub = this.service.getWordListByName(this.name, this.id).subscribe(i => {
      this.wordlist = i;
      this.originalName = i.name;
      this.getAllWords();
      this.enabled = i.enabled;
    });
  }



  getAllWords() {
    const temp: Word[] = [];
    temp.push(...this.wordlist.nouns);
    temp.push(...this.wordlist.verbs);
    temp.push(...this.wordlist.adjectives);
    temp.push(...this.wordlist.misc);
    console.log(temp);
    this.words = temp;
    this.types = this.refreshTypes(temp);
  }

  refreshTypes(temp){
    return temp.map(w =>
      this.wordlist.nouns.includes(w) ? 'Noun' :
        this.wordlist.verbs.includes(w) ? 'Verb' :
          this.wordlist.adjectives.includes(w) ? 'Adjective' : 'Misc'
    );
  }

  deleteWordList() {
    const c = this.service.deleteWordList(this.wordlist, this.id).subscribe();
    this.router.navigate(['packs', this.id]);
    return c;
  }

  deleteWord(i: number) {
    for (const current of
      [this.wordlist.nouns,
      this.wordlist.verbs,
      this.wordlist.adjectives,
      this.wordlist.misc]) {
      console.log(current + ' ' + this.words[i]);

      if (current.includes(this.words[i])) {
        current.splice(current.indexOf(this.words[i]), 1);
        this.words.splice(i, 1);
      }
    }
  }
  save() {
    this.wordlist.name = this.name;
    this.wordlist.enabled = this.enabled;
    console.log(this.wordlist);
    this.service.editWordList(this.originalName, this.wordlist, this.id).subscribe();
    this.router.navigate(['packs', this.id ]);
  }
  export() {
    this.wordlist.name = this.name;
    const blob = new Blob([JSON.stringify(this.wordlist)], { type: 'text/csv' });
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = 'export.json';
    a.click();
  }

}

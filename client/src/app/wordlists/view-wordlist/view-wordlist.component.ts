import { WordList } from './../../datatypes/wordlist';
import { Subscription } from 'rxjs';
import { WordListService } from 'src/app/services/wordlist.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Word } from 'src/app/datatypes/word';

@Component({
  selector: 'app-view-wordlist',
  templateUrl: './view-wordlist.component.html',
  styleUrls: ['./view-wordlist.component.scss']
})
export class ViewWordlistComponent implements OnInit {

  name = '';
  enabled: boolean;
  wordlist: WordList;
  words: Word[];
  types: string[];
  getUserSub: Subscription;

  constructor(private route: ActivatedRoute, private service: WordListService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.name = pmap.get('name');
      if (this.getUserSub) {
        this.getUserSub.unsubscribe();
      }
      this.getUserSub = this.service.getWordListByName(this.name).subscribe(i => {
        this.wordlist = i;
        this.getAllWords();
        this.enabled = i.enabled;
        console.log(this.enabled);

      });
    });
  }

  enable(val: any) {
  }


  getAllWords() {
    const temp: Word[] = [];
    if (this.wordlist) {
      temp.push(...this.wordlist.nouns);
      temp.push(...this.wordlist.verbs);
      temp.push(...this.wordlist.adjectives);
      temp.push(...this.wordlist.misc);
      console.log(temp);
      this.words = temp;
      this.types = temp.map(w =>
        this.wordlist.nouns.includes(w) ? 'Noun' :
          this.wordlist.verbs.includes(w) ? 'Verb' :
            this.wordlist.adjectives.includes(w) ? 'Adjective' : 'Misc'
      );
    }

  }

  deleteWord(i: number) {
    for (const current of
      [this.wordlist.nouns,
      this.wordlist.verbs,
      this.wordlist.adjectives,
      this.wordlist.misc]) {
      if (current.includes(this.wordlist[i])) {
        current.splice(i, 1);
        this.service.editWordList(this.wordlist);
      }
    }
  }
}

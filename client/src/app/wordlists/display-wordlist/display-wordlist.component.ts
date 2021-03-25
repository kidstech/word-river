import { WordListService } from 'src/app/services/wordlist.service';
import { Component, OnInit } from '@angular/core';
import { WordList } from 'src/app/datatypes/wordlist';

@Component({
  selector: 'app-display-wordlist',
  templateUrl: './display-wordlist.component.html',
  styleUrls: ['./display-wordlist.component.scss']
})
export class DisplayWordlistComponent implements OnInit {
  title = 'Word Lists';
  list: WordList[] = [];
  wordcount = 0;

  constructor(private service: WordListService) { }

  ngOnInit(): void {
    this.service.getWordList().subscribe(list=>{
      this.list = list;
      this.countWords();
    });
  }

  countWords(){
    let count = 0;
    if(this.list && this.list.length > 0){
      this.list.forEach(w => {
        count += w.adjectives.length + w.nouns.length + w.verbs.length + w.misc.length;
      });
    }
    this.wordcount = count;
  }

  getId(): string {
    const url: string[] = location.href.split('/');
    const id: string = url[4];
    return id;
  }



}

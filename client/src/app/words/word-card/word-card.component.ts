import { WordListService } from 'src/app/services/wordlist.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/datatypes/word';
import { WordList } from 'src/app/datatypes/wordlist';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})
export class WordCardComponent implements OnInit {

  @Input() word: Word;
  @Input() type: string;
  @Input() wordList: WordList;

  @Input() viewing: boolean;

  @Output() delete = new EventEmitter();

  constructor(private service: WordListService) {}

  ngOnInit(): void {
    console.log(this.word);

  }

  deleteWord(){
    this.delete.emit();
  }

}

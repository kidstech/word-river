import { WordListService } from 'src/app/services/wordlist.service';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Word } from 'src/app/datatypes/word';
import { WordList } from 'src/app/datatypes/wordlist';

@Component({
  selector: 'app-word-card',
  templateUrl: './word-card.component.html',
  styleUrls: ['./word-card.component.scss']
})
export class WordCardComponent {

  @Input() word: Word;
  @Input() type: string;
  @Input() wordList: WordList;
  @Input() viewing: boolean;
  @Input() isList = false;
  @Output() delete = new EventEmitter();

  hovering = false;

  constructor(private service: WordListService) {}

  deleteWord(){
    this.delete.emit();
  }
}

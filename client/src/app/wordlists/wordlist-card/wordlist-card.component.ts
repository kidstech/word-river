import { WordList } from './../../datatypes/wordlist';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-wordlist-card',
  templateUrl: './wordlist-card.component.html',
  styleUrls: ['./wordlist-card.component.scss']
})
export class WordlistCardComponent {

  @Input() wordlist: WordList;
  @Input() disableButton = false;
  @Input() id: string;

}

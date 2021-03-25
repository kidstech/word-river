import { WordList } from './../../datatypes/wordlist';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-wordlist-card',
  templateUrl: './wordlist-card.component.html',
  styleUrls: ['./wordlist-card.component.scss']
})
export class WordlistCardComponent implements OnInit {

  @Input() wordlist: WordList;
  @Input() disableButton = false;

  constructor() { }

  ngOnInit(): void {
  }

  getId(): string {
    const url: string[] = location.href.split('/');
    const id: string = url[4];
    return id;
  }

}

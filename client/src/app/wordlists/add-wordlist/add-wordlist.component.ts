import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/datatypes/word';

@Component({
  selector: 'app-add-wordlist',
  templateUrl: './add-wordlist.component.html',
  styleUrls: ['./add-wordlist.component.scss']
})
export class AddWordlistComponent implements OnInit {

  words: Word[] = [
    { word: 'sample word', forms: ['form1,form2'] },
    { word: 'sample word2', forms: ['form1,form2'] },
  ];
  enabled = true;

  constructor() { }


  ngOnInit(): void {
  }

  enable(val) {
    this.enabled = val;
  }

}

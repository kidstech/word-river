import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-word',
  templateUrl: './add-word.component.html',
  styleUrls: ['./add-word.component.scss']
})
export class AddWordComponent implements OnInit {

  forms = [''];

  constructor() { }

  ngOnInit(): void {
  }
  add(val) { this.forms.push(val); }
}

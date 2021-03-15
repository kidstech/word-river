import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrls: ['./edit-word.component.scss']
})
export class EditWordComponent implements OnInit {
  forms = [''];
  constructor() { }

  ngOnInit(): void {
  }
  add(val) { this.forms.push(val);}
}

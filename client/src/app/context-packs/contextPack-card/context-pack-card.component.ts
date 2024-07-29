import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ContextPack } from '../../datatypes/contextPacks';

@Component({
  selector: 'app-cp-card',
  templateUrl: './context-pack-card.component.html',
  styleUrls: ['./context-pack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextPack: ContextPack;
  @Input() simple?= false;
  @Output() delete = new EventEmitter();

  count: number;
  deleteClicked = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.countWords();
  }

  deletePack(event) {
    event.stopPropagation();
    this.delete.emit();
  }

  export(event) {
    event.stopPropagation();
    const {schema,name,icon,wordlists,enabled} = this.contextPack;
    const blob = new Blob([JSON.stringify({schema,name,icon,enabled,wordlists})], { type: 'text/csv' });
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.contextPack.name + ' pack' + '.json';
    a.click();
  }

  openContextPack() {
    this.router.navigate(['packs', this.contextPack._id]);
  }
  countWords() {
    let count = 0;
    if(this.contextPack && this.contextPack.wordlists) {this.contextPack.wordlists.forEach(list =>
      count += list.adjectives.length + list.nouns.length + list.verbs.length + list.misc.length
    );}
    this.count = count;
  }
  toggle(event){
    event.stopPropagation();
    this.deleteClicked = !this.deleteClicked;
  }
}

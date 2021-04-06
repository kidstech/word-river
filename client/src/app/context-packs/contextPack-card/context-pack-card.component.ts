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

  setDefaultIcon() {
    this.contextPack.icon = 'https://i.redd.it/awbsnq5xefy41.png';
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

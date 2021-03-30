import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ContextPack } from '../../datatypes/contextPacks';

@Component({
  selector: 'app-cp-card',
  templateUrl: './context-pack-card.component.html',
  styleUrls: ['./context-pack-card.component.scss']
})
export class ContextPackCardComponent implements OnInit {

  @Input() contextPack: ContextPack;
  @Input() simple ? = false;
  @Output() delete = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  deletePack() {
   this.delete.emit();
  }

  setDefaultIcon() {
    this.contextPack.icon = 'https://i.redd.it/awbsnq5xefy41.png';
  }
}

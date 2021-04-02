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
  @Input() simple ? = false;
  @Output() delete = new EventEmitter();

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  deletePack(event) {
    event.stopPropagation();
   this.delete.emit();
  }

  setDefaultIcon() {
    this.contextPack.icon = 'https://i.redd.it/awbsnq5xefy41.png';
  }

  openContextPack(){
    this.router.navigate(['packs',this.contextPack._id]);
  }
}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { ContextPackService } from 'src/app/services/contextPack-service/contextpack.service';
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

  constructor(private router: Router, private packService: ContextPackService) { }

  ngOnInit(): void {
  }

  deletePack() {
   this.delete.emit();
  }

}

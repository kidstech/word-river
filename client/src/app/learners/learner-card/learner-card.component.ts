import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-learner-card',
  templateUrl: './learner-card.component.html',
  styleUrls: ['./learner-card.component.scss']
})
export class LearnerCardComponent implements OnInit {
  @Input() learner;

  constructor() { }


  ngOnInit(): void {
  }

}

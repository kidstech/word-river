import { Component, Input, OnInit } from '@angular/core';
import { Story } from 'src/app/datatypes/story';

@Component({
  selector: 'app-story-card',
  templateUrl: './story-card.component.html',
  styleUrls: ['./story-card.component.scss']
})
export class StoryCardComponent implements OnInit {

  @Input() story: Story;
  @Input() simple?: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Story } from '../datatypes/story';
import { StoriesService } from '../services/stories-service/stories.service';

@Component({
  selector: 'app-story-details',
  templateUrl: './story-details.component.html',
  styleUrls: ['./story-details.component.scss']
})
export class StoryDetailsComponent implements OnInit {

  storyName: string;
  storyId: string;
  theStory: Story;
  constructor(
    private route: ActivatedRoute,
    private storyService: StoriesService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      console.log(pmap);
      console.log('This is ngOnInit');
      this.storyName = pmap.get('storyName');
      this.storyId = pmap.get('storyId');

      this.storyService.getLearnerStory(this.storyName, this.storyId).subscribe(res=> {
        this.theStory = res;
      },
      error => {
        console.log(error);
      });
    });
  }
}

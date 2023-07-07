import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StoryDetailsComponent } from './story-details.component';

describe('StoryDetailsComponent', () => {
  let component: StoryDetailsComponent;
  let fixture: ComponentFixture<StoryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StoryDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

/*
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { of } from 'rxjs';
import { StoryDetailsComponent } from './story-details.component';
import { StoriesService } from '../services/stories-service/stories.service';
import { Story } from '../datatypes/story';

describe('StoryDetailsComponent', () => {
  let component: StoryDetailsComponent;
  let fixture: ComponentFixture<StoryDetailsComponent>;
  let activatedRoute: ActivatedRoute;
  let storiesService: StoriesService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StoryDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of({ get: (param: string) => 'storyId' } as ParamMap),
          },
        },
        {
          provide: StoriesService,
          useValue: {
            getLearnerStory: () => of({ _id?', 'learnerId', 'storyName', 'font?', 'sentences' }),
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDetailsComponent);
    component = fixture.componentInstance;
    activatedRoute = TestBed.inject(ActivatedRoute);
    storiesService = TestBed.inject(StoriesService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set the storyName and storyId from the route parameters', () => {
    expect(component.storyName).toBe('storyName');
    expect(component.storyId).toBe('storyId');
  });

  it('should call getLearnerStory and set theStory', () => {
    spyOn(storiesService, 'getLearnerStory').and.callThrough();

    component.ngOnInit();

    expect(storiesService.getLearnerStory).toHaveBeenCalledWith('storyId', 'storyId');
   // expect(component.theStory).toEqual('_id', 'learnerId', 'storyName' );
  });

  it('should set theStory with the correct storyName', () => {
    // Arrange
    const expectedStoryName = 'Expected Story Name';
    const expectedStory: Story = {
      learnerId: 'learnerIdValue',
      storyName: expectedStoryName,
      sentences: []
    };

    // Act (assuming the assignment happens in the ngOnInit method)
    component.ngOnInit();

    // Assert
    expect(component.theStory).toEqual(expectedStory);
  });

});

*/

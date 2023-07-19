import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of, throwError } from 'rxjs';
import { StoryDetailsComponent } from './story-details.component';
import { StoriesService } from '../services/stories-service/stories.service';
import { Story } from '../datatypes/story';

describe('StoryDetailsComponent', () => {
  let component: StoryDetailsComponent;
  let fixture: ComponentFixture<StoryDetailsComponent>;
  let routeMock: any;
  let storyServiceMock: any;
  let getLearnerStorySpy: jasmine.Spy;

  const mockStory: Story = {
    _id: 'mockId',
    learnerId: 'mockLearnerId',
    storyName: 'Mock Story',
    font: 'Arial',
    sentences: ['This is sentence 1', 'This is sentence 2', 'This is sentence 3'],
  };

  beforeEach(async () => {
    routeMock = {
      paramMap: of({
        get: (param: string) => {
          if (param === 'storyName') {
            return 'sampleStoryName';
          }
          if (param === 'storyId') {
            return 'sampleStoryId';
          }
        },
      }),
    };

    storyServiceMock = jasmine.createSpyObj('StoriesService', ['getLearnerStory']);
    storyServiceMock.getLearnerStory.and.returnValue(of(mockStory));

    await TestBed.configureTestingModule({
      declarations: [StoryDetailsComponent],
      providers: [
        { provide: ActivatedRoute, useValue: routeMock },
        { provide: StoriesService, useValue: storyServiceMock },
      ],
    }).compileComponents();
  });


  beforeEach(() => {
    fixture = TestBed.createComponent(StoryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should retrieve story details on initialization', () => {
    expect(component).toBeTruthy(); // Component should be created successfully

    // The component properties should be assigned with the expected values from route parameters
    expect(component.storyName).toBe('sampleStoryName');
    expect(component.storyId).toBe('sampleStoryId');

    // Trigger change detection and wait for the asynchronous operations to complete
    fixture.detectChanges();

    // The storyService.getLearnerStory method should be called with the expected parameters
    expect(storyServiceMock.getLearnerStory).toHaveBeenCalledWith('sampleStoryName', 'sampleStoryId');

    // The story details should be assigned to the component's 'theStory' property
    expect(component.theStory).toEqual(mockStory);
  });

  /*it('should handle API call error', () => {
    const errorMessage = 'API Error';

    // Mock an error in the storyService.getLearnerStory method
    spyOn(storyServiceMock, 'getLearnerStory').and.returnValue(throwError(errorMessage));

    // Trigger change detection and wait for the asynchronous operations to complete
    fixture.detectChanges();

    // The error should be logged to the console
    expect(console.log).toHaveBeenCalledWith(errorMessage);
  });*/
});

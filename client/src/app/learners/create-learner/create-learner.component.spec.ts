import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateLearnerComponent } from './create-learner.component';

describe('CreateLearnerComponent', () => {
  let component: CreateLearnerComponent;
  let fixture: ComponentFixture<CreateLearnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateLearnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

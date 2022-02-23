import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LearnerDataComponent } from './learner-data.component';

describe('LearnerDataComponent', () => {
  let component: LearnerDataComponent;
  let fixture: ComponentFixture<LearnerDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LearnerDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LearnerDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

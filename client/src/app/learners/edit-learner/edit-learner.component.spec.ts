import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditLearnerComponent } from './edit-learner.component';

describe('EditLearnerComponent', () => {
  let component: EditLearnerComponent;
  let fixture: ComponentFixture<EditLearnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditLearnerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditLearnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

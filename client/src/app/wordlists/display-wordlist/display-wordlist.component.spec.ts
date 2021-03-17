import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayWordlistComponent } from './display-wordlist.component';

describe('DisplayWordlistComponent', () => {
  let component: DisplayWordlistComponent;
  let fixture: ComponentFixture<DisplayWordlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayWordlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayWordlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should count number of words', () => {

  });
});

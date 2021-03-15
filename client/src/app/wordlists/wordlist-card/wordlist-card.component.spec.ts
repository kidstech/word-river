import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WordlistCardComponent } from './wordlist-card.component';

describe('WordlistCardComponent', () => {
  let component: WordlistCardComponent;
  let fixture: ComponentFixture<WordlistCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordlistCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordlistCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

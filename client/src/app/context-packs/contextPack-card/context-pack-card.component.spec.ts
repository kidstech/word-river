import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContextPackCardComponent } from './context-pack-card.component';

describe('ContextPackCardComponent', () => {
  let component: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ContextPackCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContextPackCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

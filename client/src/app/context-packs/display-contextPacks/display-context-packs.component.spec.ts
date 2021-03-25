import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DisplayContextPacksComponent } from './display-context-packs.component';

describe('DisplayContextPacksComponent', () => {
  let component: DisplayContextPacksComponent;
  let fixture: ComponentFixture<DisplayContextPacksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DisplayContextPacksComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DisplayContextPacksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

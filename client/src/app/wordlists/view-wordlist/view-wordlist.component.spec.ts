import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewWordlistComponent } from './view-wordlist.component';

describe('ViewWordlistComponent', () => {
  let component: ViewWordlistComponent;
  let fixture: ComponentFixture<ViewWordlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWordlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewWordlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

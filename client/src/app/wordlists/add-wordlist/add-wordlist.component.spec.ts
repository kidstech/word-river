import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWordlistComponent } from './add-wordlist.component';

describe('AddWordlistComponent', () => {
  let component: AddWordlistComponent;
  let fixture: ComponentFixture<AddWordlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWordlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWordlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

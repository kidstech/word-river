import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddWordListComponent } from './add-wordlist.component';

describe('AddWordListComponent', () => {
  let component: AddWordListComponent;
  let fixture: ComponentFixture<AddWordListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddWordListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWordListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not accept an empty name', () => {
    cons
  });
});

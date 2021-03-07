import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportWordlistComponent } from './import-wordlist.component';

describe('ImportWordlistComponent', () => {
  let component: ImportWordlistComponent;
  let fixture: ComponentFixture<ImportWordlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportWordlistComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ImportWordlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

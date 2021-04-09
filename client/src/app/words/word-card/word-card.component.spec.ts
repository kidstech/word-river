import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';

import { WordCardComponent } from './word-card.component';

describe('WordCardComponent', () => {
  let component: WordCardComponent;
  let fixture: ComponentFixture<WordCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WordCardComponent ],
      imports: [HttpClientTestingModule,RouterTestingModule,RouterModule.forRoot([]),COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WordCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit a delete event when deleteWord is called', () => {
    spyOn(component.delete, 'emit');
    component.deleteWord();
    expect(component.delete.emit).toHaveBeenCalled();
  });
});

import { MockDictionaryService } from './../../../testing/dictionary-service-mock';
import { DictionaryService } from 'src/app/services/dictionary-service/dictionary.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, flush, flushMicrotasks, TestBed, tick } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';

import { AddWordComponent } from './add-word.component';

describe('AddWordComponent', () => {
  let component: AddWordComponent;
  let fixture: ComponentFixture<AddWordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddWordComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, RouterModule.forRoot([]), COMMON_IMPORTS],
      providers: [
        { provide: WordListService, useValue: new MockWordListService() },
      { provide: DictionaryService, useValue: new MockDictionaryService() }]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('add() should add a form', () => {
    expect(component.forms).toEqual(['']);
    component.add('bears');
    expect(component.forms).toEqual(['', 'bears']);
  });
  it('removeForm() should remove a form when there is more than one', () => {
    component.add('bears');
    component.add('tuna');
    expect(component.forms).toEqual(['', 'bears', 'tuna']);
    component.removeForm(0);
    expect(component.forms).toEqual(['bears', 'tuna']);
  });
  it('removeForm() should remove last form but keep a placeholder', () => {
    component.forms = [''];
    component.removeForm(0);
    expect(component.forms).toEqual(['']);
  });

  it('should not accept empty names and types', () => {
    component.wordName = '';
    component.type = '';
    component.check();
    expect(component.finished).toBe(component.check());
  });

  it('should not accept a one character name', () => {
    component.wordName = 'k';
    component.check();
    expect(component.finished).toBe(component.check());
  });
  it('check() should work', () => {
    component.wordName = 'sda';
    component.type = 'Noun';
    expect(component.check()).toBe(true);
  });
  it('suggest() should work', fakeAsync(() => {
    component.wordName = 'tuna';
    component.type = 'Verb';
    component.suggest();
    tick(1000);
    setTimeout(() => { expect(component.type).toBe('nouns'); }, 1000);
    flush();
  }));
  it('save() clears all fields', () => {
    component.wordName = 'sda';
    component.type = 'Noun';
    component.forms = ['', '', ''];
    component.save();
    expect(component.wordName).toBe('');
    expect(component.type).toBe('Noun');
    expect(component.forms).toEqual(['']);
  });
});

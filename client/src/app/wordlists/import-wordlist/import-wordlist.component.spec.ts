import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordList } from 'src/app/datatypes/wordlist';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';
import { DisplayWordlistComponent } from '../display-wordlist/display-wordlist.component';

import { ImportWordlistComponent } from './import-wordlist.component';

describe('ImportWordlistComponent', () => {
  let component: ImportWordlistComponent;
  let fixture: ComponentFixture<ImportWordlistComponent>;
  const ex = {
    name: 'animal',
    enabled: true,
    nouns:[{word:'pig',forms:['pig','pigs']}],
    verbs:[{word:'sniff',forms:['sniffs','sniffing']}],
    adjectives:[{word:'round',forms:['rounder','round']}],
    misc:[{word:'to',forms:['to']}]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ImportWordlistComponent ],
      imports: [HttpClientTestingModule,RouterTestingModule.withRoutes([
        { path: 'wordlist', component: DisplayWordlistComponent }
      ]),COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() }]
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
  it('should save', () => {
    component.wordlist = ex;
    expect(component.save()).toBe(true);
    component.wordlist = undefined;
    expect(component.save()).toBe(false);
  });

});

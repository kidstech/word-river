import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ViewWordlistComponent } from './view-wordlist.component';
import { WordList } from './../../datatypes/wordlist';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';

describe('ViewWordlistComponent', () => {
  let component: ViewWordlistComponent;
  let fixture: ComponentFixture<ViewWordlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ViewWordlistComponent ],
      imports: [HttpClientTestingModule,RouterTestingModule,RouterModule.forRoot([]),COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() }]
    })
    .compileComponents();
  });

  beforeEach(waitForAsync(() => {
    TestBed.compileComponents().then(() => {
      fixture = TestBed.createComponent(ViewWordlistComponent);
      component = fixture.componentInstance;
      fixture.detectChanges();
      component.name = 'animal';
      component.loadWords();
    });
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should delete a wordlist', () => {
    expect(component.deleteWordList()).toBeTruthy();
  });
  it('should save', () => {
    component.wordlist = {name:'',enabled:false,nouns:[],verbs:[],adjectives:[],misc:[]};
    component.enabled = false;
    component.save();
    expect(component).toBeTruthy();
  });
  it('should export', () => {
    component.wordlist = {name:'',enabled:false,nouns:[],verbs:[],adjectives:[],misc:[]};
    component.export();
    expect(component).toBeTruthy();
  });
});

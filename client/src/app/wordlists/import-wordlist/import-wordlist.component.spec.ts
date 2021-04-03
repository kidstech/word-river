import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { COMMON_IMPORTS } from 'src/app/app-routing.module';
import { WordListService } from 'src/app/services/wordlist.service';
import { MockWordListService } from 'src/testing/wordlist.service.mock';
import { DisplayWordlistComponent } from '../display-wordlist/display-wordlist.component';
import { ImportWordlistComponent } from './import-wordlist.component';

describe('ImportWordlistComponent', () => {
  let component: ImportWordlistComponent;
  let fixture: ComponentFixture<ImportWordlistComponent>;
  const paramMap = new Map();
  paramMap.set('id','meow');
  const ex = {
    name: 'testWordlistForImport',
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
        { path: 'packs/meow', component: DisplayWordlistComponent }
      ]),COMMON_IMPORTS],
      providers: [{ provide: WordListService, useValue: new MockWordListService() },  {
        provide: ActivatedRoute,
        useValue: {
          paramMap: of(paramMap)
        }
      }]
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
    component.id = 'meow';
    expect(component.save()).toBe(true);
    component.wordlist = undefined;
    expect(component.save()).toBe(false);
  });

});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { WordList } from 'src/app/datatypes/wordlist';
import { ContextPackCardComponent } from './context-pack-card.component';
import { ContextPackService } from 'src/app/services/contextPack-service/contextpack.service';
import { MockCPService } from 'src/testing/context-pack.service.mock';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DisplayContextPacksComponent } from '../display-contextPacks/display-context-packs.component';


describe('CpCardComponent', () => {
  let cpCard: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule,
        HttpClientTestingModule,RouterTestingModule.withRoutes([
          { path: '', component: DisplayContextPacksComponent }
            ])],
      declarations: [ ContextPackCardComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockCPService() }]
      })
    .compileComponents();
  });

  beforeEach(() => {
    const testList: Array<WordList> = MockCPService.testCPs[0].wordlists;
    fixture = TestBed.createComponent(ContextPackCardComponent);
    cpCard = fixture.componentInstance;
    cpCard.contextPack = {
      _id: 'computer',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'Iron Man',
      icon: 'image.png',
      enabled: true,
      wordlist: testList,
      wordlists: testList
    };
    fixture.detectChanges();
  });



  it('should create', () => {
    expect(cpCard).toBeTruthy();
  });

  it('should delete a context pack', () => {
    expect(cpCard).toBeTruthy();
    expect(cpCard.deletePack({stopPropagation:()=>{}})).toBeUndefined();
  });
  it('count the words', () => {
    cpCard.contextPack = {
      _id: 'computer',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'Iron Man',
      icon: 'image.png',
      enabled: true,
      wordlist: [],
      wordlists: MockCPService.testCPs[0].wordlist
    };
    cpCard.countWords();
    expect(cpCard.count).toBe(10);
  });
});

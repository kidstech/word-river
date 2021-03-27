import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { WordList } from 'src/app/datatypes/wordlist';
import { ContextPackCardComponent } from './context-pack-card.component';


describe('CpCardComponent', () => {
  let cpCard: ContextPackCardComponent;
  let fixture: ComponentFixture<ContextPackCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [ ContextPackCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    const testList: Array<WordList> = [];
    fixture = TestBed.createComponent(ContextPackCardComponent);
    cpCard = fixture.componentInstance;
    cpCard.contextPack = {
      _id: 'woof',
      schema: 'https://raw.githubusercontent.com/kidstech/story-builder/master/Assets/packs/schema/pack.schema.json',
      name: 'canines',
      icon: 'image.png',
      enabled: true,
      wordlist: testList
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(cpCard).toBeTruthy();
  })
;
});

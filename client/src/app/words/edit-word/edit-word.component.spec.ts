import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EditWordComponent } from './edit-word.component';


describe('EditWordComponent', () => {
  let component: EditWordComponent;
  let fixture: ComponentFixture<EditWordComponent>;
  const testWord: any = [
    { word: 'Dog', forms: ['Dog', 'Dogs'] },
    { word: 'Cake', forms: ['Cake', 'Cakes'] },
    { word: '', forms: ['', ''] }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditWordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditWordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


});

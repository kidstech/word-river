import { MockWordListService } from './../testing/wordlist.service.mock';
import { WordListService } from './services/wordlist.service';
import { WordList } from './datatypes/wordlist';
import { ImportWordlistComponent } from './wordlists/import-wordlist/import-wordlist.component';
import { AddContextPackComponent } from './context-packs/add-contextPacks/add-contextPacks.component';
import { MockCPService } from './../testing/context-pack.service.mock';
import { ContextPackService } from './services/contextPack-service/contextpack.service';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatListModule } from '@angular/material/list';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let location: Location;
  let router: Router;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          {path:'packs/new',component:AddContextPackComponent},
          {path:'packs/123456789112345678921234',component:AddContextPackComponent},
          {path:'packs/123456789112345678921234/import',component:ImportWordlistComponent},
          {path:'packs/123456789112345678921234/bear',component:ImportWordlistComponent},
          {path:'pages/words/toys/bread/t/b/c',component:ImportWordlistComponent},
        ]),
        MatToolbarModule,
        MatIconModule,
        MatSidenavModule,
        MatCardModule,
        MatListModule
      ],
      providers:[
        HttpClientModule,
        { provide: ContextPackService, useValue: new MockCPService() },
        { provide: WordListService, useValue: new MockWordListService() }
      ],
      declarations: [
        AppComponent
      ],
    }).compileComponents();
  }));
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    location = TestBed.get(Location);
    router = TestBed.get(Router);
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have as title 'WordRiver'`, () => {
    expect(component.title).toEqual('WordRiver');
  });

  it(`goBack() works with new contextpack page`, () => {
    router.navigate(['packs/new']);
    location.go('packs/new');
    spyOn(location, 'path').and.returnValue('packs/new');
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
  it(`goBack() works with display wordlists page`, () => {
    router.navigate(['packs/123456789112345678921234']);
    location.go('packs/123456789112345678921234');
    spyOn(location, 'path').and.returnValue('packs/123456789112345678921234');
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it(`goBack() works with import wordlist page`, () => {
    router.navigate(['packs/123456789112345678921234/import']);
    location.go('packs/123456789112345678921234/import');
    spyOn(location, 'path').and.returnValue('packs/123456789112345678921234/import');
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['packs/import']);
  });

  it(`goBack() works with add wordlist page`, () =>{
    router.navigate(['/packs/123456789112345678921234/new']);
    location.go('/packs/123456789112345678921234/new');
    spyOn(location, 'path').and.returnValue('/packs/123456789112345678921234/new');
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['packs/123456789112345678921234']);
  });

  it(`goBack() works with view wordlist page`, () => {
    router.navigate(['/packs/123456789112345678921234/bear']);
    location.go('/packs/123456789112345678921234/bear');
    spyOn(location, 'path').and.returnValue('/packs/123456789112345678921234/bear');
    spyOn(router, 'navigate');
    component.goBack();
    expect(router.navigate).toHaveBeenCalledWith(['packs/123456789112345678921234']);
  });
  it(`goBack() doesnt crash when given an invalid page`, () => {
    router.navigate(['/pages/words/toys/bread/t/b/c']);
    location.go('/pages/words/toys/bread/t/b/c');
    spyOn(location, 'back');
    spyOn(router, 'navigate');
    component.goBack();
    expect(location.back).toHaveBeenCalled();
  });
});

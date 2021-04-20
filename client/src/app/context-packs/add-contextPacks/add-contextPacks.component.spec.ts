import { AngularFireStorage } from '@angular/fire/storage';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule, FormGroup, AbstractControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { AddContextPackComponent } from './add-contextPacks.component';
import { MockCPService } from 'src/testing/context-pack.service.mock';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';
import { FireStorageMock } from 'src/testing/angular-fire-storage-mock';
import { DisplayWordlistComponent } from 'src/app/wordlists/display-wordlist/display-wordlist.component';

describe('AddCpComponent', () => {
  let addContextPack: AddContextPackComponent;
  let addContextPackForm: FormGroup;
  let fixture: ComponentFixture<AddContextPackComponent>;

  beforeEach(waitForAsync(() => {
     TestBed.configureTestingModule({
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatSnackBarModule,
        MatCardModule,
        MatFormFieldModule,
        MatSelectModule,
        MatInputModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([
          { path: 'packs/fakeid', component: DisplayWordlistComponent }
        ])
      ],
      declarations: [ AddContextPackComponent ],
      providers: [{ provide: ContextPackService, useValue: new MockCPService() },
        { provide: AngularFireStorage, useValue: new FireStorageMock() }
      ]
    })
    .compileComponents().catch(error => {
      expect(error).toBeNull();
    });
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddContextPackComponent);
    addContextPack = fixture.componentInstance;
    addContextPack.ngOnInit();
    fixture.detectChanges();
    addContextPackForm = addContextPack.addContextPackForm;
    expect(addContextPackForm).toBeDefined();
    expect(addContextPackForm.controls).toBeDefined();
  });

  it('should create', () => {
    expect(addContextPack).toBeTruthy();
    expect(addContextPackForm).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    expect(addContextPackForm.valid).toBeFalsy();
  });

  describe('The name field', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      nameControl = addContextPack.addContextPackForm.controls.name;
    });

    it('should not allow empty names', () => {
      nameControl.setValue('');
      expect(nameControl.valid).toBeFalsy();
    });

    it('should be fine with "Iron Man"', () => {
      nameControl.setValue('Iron Man');
      expect(nameControl.valid).toBeTruthy();
    });

    it('should fail on really long names', () => {
      nameControl.setValue('x'.repeat(100));
      expect(nameControl.valid).toBeFalsy();
      expect(nameControl.hasError('maxlength')).toBeTruthy();
    });

    it('should allow digits in the name', () => {
      nameControl.setValue('Spider-Man 2');
      expect(nameControl.valid).toBeTruthy();
    });
  });

  describe('The icon field', () => {
    let iconControl: AbstractControl;

    beforeEach(() => {
      iconControl = addContextPack.addContextPackForm.controls.icon;
    });

    it('should allow empty icons', () => {
      iconControl.setValue('');
      expect(iconControl.valid).toBeTruthy();
    });

    it('should be fine with "image.png"', () => {
      iconControl.setValue('image.png');
      expect(iconControl.valid).toBeTruthy();
    });

    it('should not be fine with "image.notanimage"', () => {
      iconControl.setValue('image.notanimage');
      expect(iconControl.valid).toBeFalsy();
    });
    it('should default to empty string when provided no image"', () => {
      iconControl.setValue(undefined);
      addContextPack.addContextPackForm.controls.name.setValue('boo');
      addContextPack.addContextPackForm.controls.enabled.setValue(true);
      addContextPack.submitForm();
      expect(addContextPack.addContextPackForm.value.icon).toBe('');
    });
    it('should use downloadURL when downloadUrl exists"', () => {
      iconControl.setValue(undefined);
      addContextPack.addContextPackForm.controls.name.setValue('boo');
      addContextPack.addContextPackForm.controls.enabled.setValue(true);
      addContextPack.downloadURL = 'umm.com';
      addContextPack.submitForm();
      expect(addContextPack.addContextPackForm.value.icon).toBe('umm.com');
    });
    it('should upload images"', () => {
    const mockFile = new File([''], 'filename', { type: 'text/html' });
    const mockEvt = { target: { files: [mockFile] } };
    const mockReader: FileReader = jasmine.createSpyObj('FileReader', ['readAsDataURL', 'onload']);
    spyOn(window as any, 'FileReader').and.returnValue(mockReader);

    addContextPack.onFileAdded(mockEvt as any);
    });

    it('Should throw an error upon an error', () => {
      addContextPack.addContextPackForm.controls.name.setValue(null);
      expect(addContextPack.submitForm()).toBeUndefined();
    });

  });

  describe('The enabled field', () => {
    let enabledControl: AbstractControl;

    beforeEach(() => {
      enabledControl = addContextPack.addContextPackForm.controls.enabled;
    });

    it('should not allow empty fields', () => {
      enabledControl.setValue('');
      expect(enabledControl.valid).toBeFalsy();
    });

    it('should be fine with "true"', () => {
      enabledControl.setValue('true');
      expect(enabledControl.valid).toBeTruthy();
    });

    it('should be fine with "false"', () => {
      enabledControl.setValue('false');
      expect(enabledControl.valid).toBeTruthy();
    });

    it('should fail on status that are not either "true" or "false"', () => {
      enabledControl.setValue('nOtAbOoLeAn');
      expect(enabledControl.valid).toBeFalsy();
      expect(enabledControl.hasError('pattern')).toBeTruthy();
    });
  });
});

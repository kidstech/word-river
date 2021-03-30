import { Component, OnInit } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { finalize } from 'rxjs/operators';
import { ContextPack } from '../../datatypes/contextPacks';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';


@Component({
  selector: 'app-add-cp',
  templateUrl: './add-contextPacks.component.html',
  styleUrls: ['./add-contextPacks.component.scss']
})
export class AddContextPackComponent implements OnInit {

  addContextPackForm: FormGroup;

  contextPack: ContextPack;

  addCpValidationMessages = {
    name: [
      { type: 'required', message: 'A name is required' },
      { type: 'maxlength', message: 'The name cannot exceed 50 characters' },
      { type: 'existingName', message: 'This name has already been taken' }
    ],

    icon: [
      { type: 'pattern', message: 'Image must be a .jpg,.png or .gif' }
    ],

    enabled: [
      { type: 'required', message: 'You must specify whether the pack is enabled or disabled' },
    ]
  };
  downloadURL: any;
  uploaded = false;

  constructor(
    private fb: FormBuilder,
    private storage: AngularFireStorage,
    private cpService: ContextPackService,
    private snackBar: MatSnackBar,
    private router: Router) { }

  createForms() {
    this.addContextPackForm = this.fb.group({
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.maxLength(50),
      ])),

      icon: new FormControl('', Validators.compose([
        Validators.pattern('.+\.(png|jpg|jpeg|gif)$')
      ])),

      enabled: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^(true|false)$'),
      ]))
    });
  }

  ngOnInit(): void {
    this.createForms();
  }

  submitForm() {
    if(!this.addContextPackForm.value.icon){
      this.addContextPackForm.value.icon = this.downloadURL ? this.downloadURL : '';
    }
    this.cpService.addPack(this.addContextPackForm.value).subscribe(newID => {
      this.snackBar.open('Added the ' + this.addContextPackForm.value.name + ' context pack successfully', null, {
        duration: 2000,
      });
      this.router.navigate(['/packs/', newID]);
    }, err => {
      console.log(err);
      this.snackBar.open('Failed to add the context pack', 'OK', {
        duration: 5000,
      });
    });
  }
  onFileAdded(event) {

    const file = event.target.files[0];
    const filePath = `${Math.floor(Math.random() * 100000000)}`;
    const fileRef = this.storage.ref(filePath);
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL().subscribe(link=>{
          this.downloadURL = link;
          this.uploaded = true;
        });
      })
    )
      .subscribe();
  }
}

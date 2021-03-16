import { Component, OnInit } from '@angular/core';
import { Word } from 'src/app/datatypes/word';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { WordList } from 'src/app/datatypes/wordlist';
import { WordListService } from 'src/app/services/wordlist.service';

@Component({
  selector: 'app-add-wordlist',
  templateUrl: './add-wordlist.component.html',
  styleUrls: ['./add-wordlist.component.scss']
})
export class AddWordListComponent implements OnInit {

  addWordListForm: FormGroup;

  wordList: WordList;

  words: Word[] = [
    { word: 'sample word', forms: ['form1,form2'] },
    { word: 'sample word2', forms: ['form1,form2'] },
  ];
  enabled = true;

  addWordListValidationMessages = {
    name: [
      {type: 'required', message: 'Name is required'},
      {type: 'minlength', message: 'Name must be at least 2 characters long'},
      {type: 'maxlength', message: 'Name cannot be more than 50 characters long'},
      {type: 'existingName', message: 'Name has already been taken'}
    ],
  };

  constructor(private fb: FormBuilder, private wordListService: WordListService, private snackBar: MatSnackBar, private router: Router) {
  }

  createForms() {

    // add user form validations
    this.addWordListForm = this.fb.group({
      // We allow alphanumeric input and limit the length for name.
      name: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(2),
        // In the real world you'd want to be very careful about having
        // an upper limit like this because people can sometimes have
        // very long names. This demonstrates that it's possible, though,
        // to have maximum length limits.
        Validators.maxLength(50),
        (fc) => {
          if (fc.value.toLowerCase() === 'abc123' || fc.value.toLowerCase() === '123abc') {
            return ({existingName: true});
          } else {
            return null;
          }
        },
      ])),
    });

  }

ngOnInit() {
  this.createForms();
}

submitForm() {
  this.wordListService.addWordList(this.addWordListForm.value).subscribe(newName => {
    this.snackBar.open('Added Word List ' + this.addWordListForm.value.name, null, {
      duration: 2000,
    });
    this.router.navigate(['/wordlist/', newName]);
  }, err => {
    this.snackBar.open('Failed to add the word list', 'OK', {
      duration: 5000,
    });
  });
}

  enable(val) {
    this.enabled = val;
  }

}

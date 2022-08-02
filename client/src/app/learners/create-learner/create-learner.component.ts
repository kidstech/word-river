import { LoginService } from 'src/app/services/login-service/login.service';
import { UserService } from './../../services/user-service/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileService } from 'src/app/services/file.service';
import { MatFormField, MatFormFieldControl} from '@angular/material/form-field';

@Component({
  selector: 'app-create-learner',
  templateUrl: './create-learner.component.html',
  styleUrls: ['./create-learner.component.scss']
})
export class CreateLearnerComponent implements OnInit {
  uploading;
  downloadURL: any;
  uploaded: boolean;
  name: string;
  selected: string;
  constructor(
    private storage: AngularFireStorage,
    private users: UserService,
    private login: LoginService,
    private files: FileService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onFileAdded(event) {
    this.files.onFileAdded(event, () => {
      this.uploading = true;
    }, (link) => {
      this.downloadURL = link;
      this.uploaded = true;
      this.uploading = false;
    });
  }
  createLearner(){
    this.users.createLearner(this.login.authID,{name:this.name,icon:this.downloadURL,learnerPacks:[]})
     .subscribe(_=>{
       this.router.navigate(['/home']);
     }, err=>console.log(err)
     );
  }

  inputChange(event) {
    console.log(this.selected);

    switch (this.selected) {
        case 'moose':
            this.downloadURL = '/assets/moose.png';
            break;
        case 'narwhal':
            this.downloadURL = '/assets/narwhal.png';
            break;
        case 'penguin':
            this.downloadURL = '/assets/penguin.png';
            break;
        case 'pig':
            this.downloadURL = '/assets/pig.png';
            break;
        case 'duck':
            this.downloadURL = '/assets/duck.png';
            break;

        default:
          this.downloadURL = '/assets/add-img.png';
            break;
    }

  }
}

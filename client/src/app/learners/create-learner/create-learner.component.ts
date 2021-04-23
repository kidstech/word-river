import { LoginService } from 'src/app/services/login-service/login.service';
import { UserService } from './../../services/user-service/user.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { Component, OnInit } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(
    private storage: AngularFireStorage,
    private users: UserService,
    private login: LoginService,
    private router: Router
    ) { }

  ngOnInit(): void {
  }

  onFileAdded(event) {

    const file = event.target.files[0];
    const filePath = `${Math.floor(Math.random() * 100000000)}`;
    const fileRef = this.storage.ref(filePath);
    this.uploading = true;
    const task = this.storage.upload(filePath, file);

    task.snapshotChanges().pipe(
      finalize(() => {
        this.downloadURL = fileRef.getDownloadURL().subscribe(link => {
          this.downloadURL = link;
          this.uploaded = true;
          this.uploading = false;
        });
      })
    ).subscribe();
  }
  createLearner(){
    this.users.createLearner(this.login.authID,{name:this.name,icon:this.downloadURL,learnerPacks:[]})
     .subscribe(_=>{
       this.router.navigate(['/home']);
     }, err=>console.log(err)
     );

  }
}

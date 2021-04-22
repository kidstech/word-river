import { ContextPackService } from './../../services/contextPack-service/contextpack.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { LoginService } from 'src/app/services/login-service/login.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from './../../services/user-service/user.service';
import { Component, OnInit } from '@angular/core';
import { Learner } from 'src/app/datatypes/learner';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-edit-learner',
  templateUrl: './edit-learner.component.html',
  styleUrls: ['./edit-learner.component.scss']
})
export class EditLearnerComponent implements OnInit {

  learner: Learner;
  id: string;
  name: string;
  uploading;
  downloadURL: any;
  uploaded: boolean;
  learnerPacks;
  userPacks;

  constructor(
    private users: UserService,
    private route: ActivatedRoute,
    private login: LoginService,
    private storage: AngularFireStorage,
    private packs: ContextPackService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
      this.users.getLearner(this.login.authID, this.id).subscribe(res => {
        this.learner = res;
        this.name = res.name;
        this.downloadURL = res.icon;
        this.packs.getLearnerPacks(this.login.authID, this.id).subscribe(p => {
          this.learnerPacks = p;
          this.packs.getUserPacks(this.login.authID).subscribe(px => {
            this.userPacks = px;
          });
        });
      }, err => console.log(err)
      );
    });
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
  exists(pack) {
    return this.learnerPacks.some(p => p._id === pack._id);
  }
  remove(pack) {
    console.log('agsgfag');

    this.learnerPacks = this.learnerPacks.filter(p => p._id !== pack._id);
  }
  add(pack) {
    this.learnerPacks.push(pack);
  }

  saveChanges() {
    this.users.editLearner(
      this.login.authID,
      this.learner._id,
      { _id:this.learner._id,
        name: this.name,
         icon: this.downloadURL,
          learnerPacks: this.learnerPacks.map(l=>l._id) }
    ).subscribe(res=>{
      this.router.navigate(['/home']);
    },err=>console.log(err)
    );
    // console.log({learner: this.learner._id,name: this.name, icon: this.downloadURL, learnerPacks: this.learnerPacks });

  }
}

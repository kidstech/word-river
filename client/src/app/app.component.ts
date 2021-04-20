import { LoginService } from './services/login-service/login.service';
import { ContextPackService } from './services/contextPack-service/contextpack.service';
import { ContextPack } from './datatypes/contextPacks';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WordRiver';
  backButtonVisible = false;
  contextPackVisible = false;
  contextPack: ContextPack;
  loggedIn = false;
  uid: string;
  userName: string;
  icon: string;

  constructor(
    private location: Location,
    private router: Router,
    private service: ContextPackService,
    private login: LoginService
  ) { }

  ngOnInit(): void {
    this.loggedIn = this.login.isLoggedIn;
    this.location.onUrlChange((url, state) => {
      this.backButtonVisible = url !== '/';
      const parts = url.split('/');

      if (parts.length === 3 && parts[1] === 'packs' || parts.length <= 1 || url.length <= 1) {
        this.contextPackVisible = false;
        this.contextPack = undefined;
      } else if (parts.length >= 3 && parts.length <= 6 && parts[2]) {
        this.service.getPack(parts[2]).subscribe(pack => {
          this.contextPack = pack;
          this.contextPackVisible = true;
        });
      }
      else {
        this.contextPackVisible = false;
      }
      this.initValues();
    });

  }

  initValues() {
    this.loggedIn = this.login.isLoggedIn;
    this.uid = this.login.authID;
    this.userName = this.login.user ? this.login.user.name || '' : '';
    this.icon = this.login.user ? this.login.user.icon|| '' : '';
  }

  goBack() {
    const path = this.location.path();
    if ((/^\/?packs\/new\/?$/g).test(path) || // New Context Pack
      (/^\/?packs\/.{24}\/?$/g).test(path)) { // Display wordlists
      this.router.navigate(['']);
    }
    else if (
      (/^\/?packs\/.{24}\/import$/g).test(path) || // Import wordlist
      (/^\/?packs\/.{24}\/new$/g).test(path) ||  // add wordlist
      (/^\/?packs\/.{24}\/.{1,100}$/g).test(path) // view wordlist
    ) {
      this.router.navigate(['packs/' + path.split('/')[2]]);
    } else {
      this.location.back();
    }
  }
  logOut() {
    this.login.signOut(res => {
      console.log(res);
      this.router.navigate(['']);
    }, err => console.log(err));
  }
}

import { LoginService } from './../../services/login-service/login.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextPack } from '../../datatypes/contextPacks';
import { WordList } from '../../datatypes/wordlist';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { safe } from 'src/testing/utils';

@Component({
  selector: 'app-display-context-packs',
  templateUrl: './display-context-packs.component.html',
  styleUrls: ['./display-context-packs.component.scss']
})
export class DisplayContextPacksComponent implements OnInit, OnDestroy {

  public contextPacks: ContextPack[];
  public name: string;
  public icon: string;
  public enabled: boolean;
  public wordlist: Array<WordList>;
  public learners = [1,2,3,4];
  getPackSub: Subscription;

  constructor(private packService: ContextPackService, private router: Router, private login: LoginService) { }

  getPacksFromServer(): void {
    this.unsub();
    this.getPackSub = this.packService.getUserPacks(this.login.user.authId).subscribe(
      returnedPacks => {
        this.contextPacks = returnedPacks;
      }, err => {
        console.log(err);
      });
    safe(() => { this.name = this.login.user.name; }, this.login.user);
  }

  ngOnInit(): void {
    this.getPacksFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if (this.getPackSub) {
      this.getPackSub.unsubscribe();
    }
  }

  removeCP(id: string) {
    this.packService.deleteContextPackFromAll(this.login.user.authId, id).subscribe(() => {
      this.contextPacks = this.contextPacks.filter(cp => cp._id !== id);
    });
    return id;
  }

}

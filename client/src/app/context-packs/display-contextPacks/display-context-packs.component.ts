import { Component, OnInit, OnDestroy } from '@angular/core';
import { ContextPack } from '../../datatypes/contextPacks';
import { WordList } from '../../datatypes/wordlist';
import { ContextPackService } from '../../services/contextPack-service/contextpack.service';
import { Subscription } from 'rxjs';

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
  getPackSub: Subscription;

  constructor(private packService: ContextPackService) { }

  getPacksFromServer(): void {
    this.unsub();
    this.getPackSub = this.packService.getPacks().subscribe(
      returnedPacks => {
        this.contextPacks = returnedPacks;
    }, err => {
      console.log(err);
    });
  }

  ngOnInit(): void {
    this.getPacksFromServer();
  }

  ngOnDestroy(): void {
    this.unsub();
  }

  unsub(): void {
    if(this.getPackSub) {
      this.getPackSub.unsubscribe();
    }
  }

  removeCP(id: string){
    this.packService.deletePack(id).subscribe(e=>{
      this.contextPacks = this.contextPacks.filter(cp=>cp._id !== id);
    });
  }

}

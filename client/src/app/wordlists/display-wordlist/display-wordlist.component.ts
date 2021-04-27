import { ContextPackService } from './../../services/contextPack-service/contextpack.service';
import { WordListService } from 'src/app/services/wordlist.service';
import { Component, OnInit } from '@angular/core';
import { WordList } from 'src/app/datatypes/wordlist';
import { ActivatedRoute, Router } from '@angular/router';
import { ContextPack } from 'src/app/datatypes/contextPacks';

@Component({
  selector: 'app-display-wordlist',
  templateUrl: './display-wordlist.component.html',
  styleUrls: ['./display-wordlist.component.scss']
})
export class DisplayWordlistComponent implements OnInit {
  title = 'Word Lists';
  list: WordList[] = [];
  pack: ContextPack;
  wordcount = 0;
  id: string;
  name = '';
  deleteClicked = false;

  constructor(
    private route: ActivatedRoute,
    private service: WordListService,
    private cpservice: ContextPackService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
    });
    this.cpservice.getPack(this.id).subscribe(cp=>{
      this.pack = cp;
      this.list = cp.wordlists;
      this.countWords();
      console.log(NaN ? 'NaN':'Number');
    });
  }

  countWords() {
    let count = 0;
    if (this.list && this.list.length > 0) {
      this.list.forEach(w => {
        count += w.adjectives.length + w.nouns.length + w.verbs.length + w.misc.length;
      });
      this.wordcount = count;
    }
    else {
      console.log('List has not been initialized');
    }
  }

  delete(){
    this.cpservice.deletePack(this.pack._id).subscribe((r)=>{
      this.router.navigate(['home']);
    });
  }

  export() {
    const {schema,name,icon,wordlists,enabled} = this.pack;
    const blob = new Blob([JSON.stringify({schema,name,icon,enabled,wordlists})], { type: 'text/csv' });
    const a = document.createElement('a');
    document.body.appendChild(a);
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = this.pack.name + ' pack' + '.json';
    a.click();
  }

}

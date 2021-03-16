import { Subscription } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { WordListService } from 'src/app/services/wordlist.service';
import { Word } from 'src/app/datatypes/word';
import { WordList } from 'src/app/datatypes/wordlist';

@Component({
  selector: 'app-edit-word',
  templateUrl: './edit-word.component.html',
  styleUrls: ['./edit-word.component.scss']
})
export class EditWordComponent implements OnInit {
  forms = [''];
  wordlistname: string;
  wordList: WordList;
  wordname: string;
  word: Word;
  originalType: string;
  editedType: string;
  getUserSub: Subscription;

  constructor(private route: ActivatedRoute, private service: WordListService) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.wordlistname = pmap.get('name');
      this.wordname = pmap.get('word');
      if (this.getUserSub) {
        this.getUserSub.unsubscribe();
      }
      this.getUserSub = this.service.getWordListByName(this.wordlistname).subscribe(wl =>{
          this.wordList = wl;
          this.wordList.getWord(this.wordname);
          this.originalType = this.wordList.getWordType(this.wordname);
          this.word = this.wordList.getWord(this.wordname);
          this.editedType = this.originalType;
        }
      );
    });
  }
  add(val) { this.forms.push(val); }

  save() {
    // const list: Word[] = this.wordList['Noun' ? 'nouns': 'Verb' ? 'verbs' : 'Adjective' ? 'adjectives' : 'misc'];
    // const index = list.indexOf(this.word);
    // if(index === -1){
    //   list.push({word:this.wordname,forms:this.forms});
    //   list.splice(,1);
    // }
    // this.service.editWordList()
    // TODO: FINISH LATER
  }
}

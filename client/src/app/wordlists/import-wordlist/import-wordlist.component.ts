import { ActivatedRoute, Router } from '@angular/router';
import { WordListService } from './../../services/wordlist.service';
import { Component, OnInit } from '@angular/core';
import { WordList } from 'src/app/datatypes/wordlist';

@Component({
  selector: 'app-import-wordlist',
  templateUrl: './import-wordlist.component.html',
  styleUrls: ['./import-wordlist.component.scss']
})
export class ImportWordlistComponent implements OnInit {

  validFile: boolean;
  file: File;
  wordlist: WordList;
  id: string;

  constructor(private route: ActivatedRoute, private service: WordListService, private router: Router) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe((pmap) => {
      this.id = pmap.get('id');
    });
  }

  onFileAdded(file) {
    this.file = file.target.files[0];
    const fileReader = new FileReader();
    fileReader.onload = () => {
      const result = fileReader.result;
      try {
        this.wordlist = JSON.parse(result as string);
        if (Array.isArray(this.wordlist)){
          this.validFile = false;
        } else {
          this.validFile = true;
        }
      } catch (err) {
        this.validFile = false;
      }
    };
    fileReader.readAsText(this.file);
  }

  save(){
    if(this.wordlist){
      this.service.addWordList(this.wordlist, this.id).subscribe(_a => this.router.navigate(['packs', this.id]));
      return true;
    }
    else {return false;}
  }
}

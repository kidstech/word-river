import { Component, OnInit } from '@angular/core';
import {Location} from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'WordRiver';
  backButtonVisible = false;
  constructor(private location: Location)
  {}
  ngOnInit(): void {
    this.location.onUrlChange((url,state)=>{
      this.backButtonVisible = url !== '/';
      console.log(url);
    });
  }

  goBack(){
    this.location.back();
  }
}

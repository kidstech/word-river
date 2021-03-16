import { DisplayWordlistComponent } from './wordlists/display-wordlist/display-wordlist.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './users/user-list.component';
import { UserProfileComponent } from './users/user-profile.component';
import { AddUserComponent } from './users/add-user.component';
import { ViewWordlistComponent } from './wordlists/view-wordlist/view-wordlist.component';
import { EditWordComponent } from './words/edit-word/edit-word.component';
import { AddWordListComponent } from './wordlists/add-wordlist/add-wordlist.component';
import { ImportWordlistComponent } from './wordlists/import-wordlist/import-wordlist.component';


const routes: Routes = [
  {path: '', component: DisplayWordlistComponent},
  {path: 'users', component: UserListComponent},
  {path: 'users/new', component: AddUserComponent},
  {path: 'users/:id', component: UserProfileComponent},
  {path: 'word/:name', component: EditWordComponent},
  {path: 'wordlist/new', component: AddWordListComponent},
  {path: 'wordlist/import', component: ImportWordlistComponent},
  {path: 'wordlist/:name', component: ViewWordlistComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

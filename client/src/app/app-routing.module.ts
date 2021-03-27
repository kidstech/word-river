import { DisplayWordlistComponent } from './wordlists/display-wordlist/display-wordlist.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ViewWordlistComponent } from './wordlists/view-wordlist/view-wordlist.component';
import { AddWordListComponent } from './wordlists/add-wordlist/add-wordlist.component';
import { ImportWordlistComponent } from './wordlists/import-wordlist/import-wordlist.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DisplayContextPacksComponent } from './context-packs/display-contextPacks/display-context-packs.component';
import { AddContextPackComponent } from './context-packs/add-contextPacks/add-contextPacks.component';

export const COMMON_IMPORTS = [
  MatButtonModule,
  MatCardModule,
  MatOptionModule,
  MatDividerModule,
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatListModule,
  MatIconModule,
  MatRadioModule,
  MatSelectModule,
  MatSnackBarModule,
  MatTooltipModule,
  BrowserAnimationsModule,
];

const routes: Routes = [
  {path: '', component: DisplayContextPacksComponent},
  {path: 'packs/new', component: AddContextPackComponent},
  {path: 'packs/:id', component: DisplayWordlistComponent},
  {path: 'packs/:id/import', component: ImportWordlistComponent},
  {path: 'packs/:id/new', component: AddWordListComponent},
  {path: 'packs/:id/:name', component: ViewWordlistComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

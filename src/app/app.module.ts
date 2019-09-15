import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { HomeComponent } from './home/home.component';
import { NoteComponent } from './note/note.component';
import { SidenavComponent } from './note/sidenav/sidenav.component';
import {
  MatCardModule,
  MatCardTitle,
  MatCheckboxModule, MatIconModule,
  MatListModule, MatMenuModule,
  MatSidenavModule,
  MatToolbarModule
} from "@angular/material";
import {FormsModule} from "@angular/forms";
import { SortPipe } from './sort.pipe';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    NoteComponent,
    SidenavComponent,
    SortPipe,
    SortPipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatSidenavModule,
    FormsModule,
    MatCheckboxModule,
    MatCardModule,
    MatListModule,
    MatIconModule,
    MatMenuModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

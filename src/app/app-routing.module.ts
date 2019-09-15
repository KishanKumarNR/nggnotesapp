import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomeComponent} from "./home/home.component";
import {NoteComponent} from "./note/note.component";


const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "notes", pathMatch: 'full', component: NoteComponent},
  {path: '**', redirectTo: '/home',}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

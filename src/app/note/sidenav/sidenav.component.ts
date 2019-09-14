import { Component, OnInit } from '@angular/core';
import {NotescollectionService} from "../../notescollection.service";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit {
  events: string[] = [];
  opened: boolean;

  notes: any[] = [];


  shouldRun = true;
  constructor(private NotescollectionService: NotescollectionService) {

  }

  ngOnInit() {
    this.NotescollectionService.getNotesAsync()
      .then((data: any) => {
        this.notes = data.data;
      })
  }

}

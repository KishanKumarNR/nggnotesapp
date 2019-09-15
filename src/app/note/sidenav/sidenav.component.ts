import {Component, OnInit} from '@angular/core';
import {NotescollectionService} from "../../notescollection.service";
import {interval, Subscription} from 'rxjs';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})

export class SidenavComponent implements OnInit {
  events: string[] = [];
  opened: boolean;
  folders: any[] = [];
  shouldRun = true;
  listNote = [];
  content: any = null;
  selectedNoteId: any;
  selectedFolderId: any;
  toggleCreateNote: boolean = true;
  toggleCreateFolder: boolean = true;
  newFolderName: any;
  newTodoName: any;
  lastModifiedDate: any;
  subscription: Subscription;
  source: any = interval(10000);
  setSelectedType: any;

  constructor(private NotescollectionService: NotescollectionService) {
    this.opened = false;
    this.mutateFolders.bind(this);
  }

  openFolder(note) {
    this.listNote = note.notes;
  }

  showProjectNav() {
    this.opened = !this.opened;
  }

  setContent(note) {
    this.content = note.data;
    this.lastModifiedDate = note.lastModifiedDate;
  }

  ngOnInit() {
    setTimeout(() => {
      this.opened = true;
    }, 2000);
    this.NotescollectionService.getNotesAsync()
      .then((data: any) => {
        this.folders = data.data;
      })
  }

  onSelectNote(id: any) {
    this.selectedNoteId = id;
    this.subscription = this.source.subscribe(val =>
      this.NotescollectionService.updateNote(this.selectedFolderId, this.selectedNoteId, this.content)
        .then((data: any) => this.folders = data)
    );
  }

  onSelectFolder(id: any) {
    this.selectedFolderId = id;
    this.selectedNoteId = null;
    this.content = null;
  }

  onTodoCreate(event: any) {
    if (event.key === "Enter") {
      this.NotescollectionService.createNoteItem(event.target.value, this.selectedFolderId)
        .then((data: any) => {
          let selectedFolderIndex = this.selectedFolderId - 1;
          this.folders = data;
          this.openFolder(this.folders[selectedFolderIndex]);
          this.toggleCreateNote = !this.toggleCreateNote;
          this.newTodoName = "";
        })
    }
  }

  onKey(event: any) {
    if (event.key === "Enter") {
      this.NotescollectionService.createFolder(event.target.value)
        .then((data: any) => {
          this.folders = data;
          this.toggleCreateFolder = !this.toggleCreateFolder;
          this.newFolderName = "";
          this.selectedFolderId = this.folders.length;
        })
    }
  }

  ngOnDestroy() {
    this.subscription && this.subscription.unsubscribe();
  }

  setType(type) {
    this.setSelectedType = type;
  }

  resetContent() {
    this.selectedNoteId = null;
    this.selectedFolderId = null;
    this.content = "";
    this.listNote = [];
    this.ngOnDestroy();
  }

  mutateFolders: any = (data) => {
    this.folders = data ? data : [];
    this.resetContent();
  };

  delete() {
    switch (this.setSelectedType) {
      case ("folder"):
        if (confirm(`Do you want to delete entire folder and its contents of ${this.selectedFolderId}`)) {
          this.NotescollectionService.deleteFolder(this.selectedFolderId)
            .then(this.mutateFolders);
        }
        break;
      case ("note"):
        if (confirm(`Do you want to delete ${this.selectedNoteId}`)) {
          this.NotescollectionService.deleteNote(this.selectedFolderId, this.selectedNoteId)
            .then(this.mutateFolders)
            .catch();
        }
        break;
    }
  }
}

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
  selectedNote: any;
  selectedFolder: any;

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

  onSelectNote(data: any) {
    this.selectedNote = JSON.parse(JSON.stringify(data));
    this.selectedNoteId = data.id;
    this.subscription = this.source.subscribe(val =>
      this.NotescollectionService.updateNote(this.selectedFolderId, this.selectedNoteId, this.content)
        .then((data: any) => this.folders = data)
    );
  }

  onSelectFolder(data: any) {
    this.selectedFolder = JSON.parse(JSON.stringify(data));
    this.selectedFolderId = data.id;
    this.selectedNoteId = null;
    this.content = null;
  }

  onTodoCreate(event: any) {
    if (event.key === "Enter") {
      this.toggleCreateNote = !this.toggleCreateNote;
      this.NotescollectionService.createNoteItem(event.target.value, this.selectedFolderId)
        .then((data: any) => {
          this.folders = data ? data : [];
          this.updateList();
          this.ngOnDestroy();
          this.content = "";
          this.newTodoName = "";
          this.selectedNoteId = null;
        })
    }
  }

  updateList() {
    for (let i = 0; i < this.folders.length; i++) {
      if (this.folders[i].id === this.selectedFolderId) {
        this.openFolder(this.folders[i]);
        break;
      }
    }
  }

  onKey(event: any) {
    if (event.key === "Enter") {
      this.toggleCreateFolder = !this.toggleCreateFolder;
      this.NotescollectionService.createFolder(event.target.value)
        .then((data: any) => {
          this.mutateFolders(data);
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
    this.newFolderName = "";
    this.newTodoName = "";
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
        if (confirm(`Do you want to delete entire folder and its contents of ${this.selectedFolder.name}`)) {
          this.NotescollectionService.deleteFolder(this.selectedFolderId)
            .then(this.mutateFolders);
        }
        break;
      case ("note"):
        if (confirm(`Do you want to delete selected note - ${this.selectedNote.id}`)) {
          this.NotescollectionService.deleteNote(this.selectedFolderId, this.selectedNoteId)
            .then((data: any) => {
              this.ngOnDestroy();
              this.content = "";
              this.selectedNoteId = null;
              this.folders = data ? data : [];
              this.updateList();
            })
            .catch();
        }
        break;
    }
  }
}

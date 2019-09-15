import {Injectable} from '@angular/core';
import {delay} from "q";
import * as dbconfig from "../store/db.json";
import {HttpClient} from "@angular/common/http";

const _NOTES = "notes";

@Injectable({
  providedIn: 'root'
})
export class NotescollectionService {

  appData: any;

  constructor(private http: HttpClient) {
    this.appData = [];
    this.init();
  }

  async syncData() {
    let str_notes = localStorage.getItem("notes");
    this.appData = JSON.parse(str_notes);
    return this.appData;
  }

  init() {
    return new Promise(async (resolve, reject) => {
      await this.http.get(dbconfig.dbUrl + "/db")
        .subscribe((data: any) => {
          let notePeristed = localStorage.getItem(_NOTES);
          notePeristed = JSON.parse(notePeristed);
          if (notePeristed === null || notePeristed.length === 0) {
            localStorage.setItem(_NOTES, JSON.stringify(data.app));
          }
          this.syncData();
          resolve(JSON.parse(JSON.stringify(this.appData)));
        }, ((error1: any) => console.log(error1)));
    });
  }

  async persisted() {
    localStorage.setItem(_NOTES, JSON.stringify(this.appData));
    return await this.syncData();
  }

  updateNote(folderId, noteId, data) {
    return new Promise(async (resolve, reject) => {
      let folder = folderId - 1;
      let note = noteId - 1;
      if (folder > -1 && note > -1) {
        this.appData[folder].notes[note].data = data;
      }
      await this.persisted();
      resolve(JSON.parse(JSON.stringify(this.appData)));
    });
  }


  async createNoteItem(value, folderId) {
    return new Promise(async (resolve) => {
      for (let i = 0; i < this.appData.length; i++) {
        if (this.appData[i].id === folderId) {
          let newNoteId = this.appData[i].notes.length + 1;
          if (newNoteId) {
            this.appData[i].notes.push({
              id: newNoteId,
              data: value,
              type: "note",
              lastModifiedDate: new Date().toDateString()
            });
          }
        }
      }
      await this.persisted();
      resolve(JSON.parse(JSON.stringify(this.appData)));
    })
  }

  public createFolder(name) {
    return new Promise(async (resolve) => {
      let length = this.appData.length + 1;
      let newFolder = {
        id: length,
        name: name,
        type: "folder",
        notes: []
      };
      this.appData.push(newFolder);
      await this.persisted();
      resolve(JSON.parse(JSON.stringify(this.appData)));
    });
  }

  async getNotesAsync() {
    await delay(200);
    await this.init();
    return {
      data: JSON.parse(JSON.stringify(this.appData))
    };
  }

  public deleteNote(folderId, noteId) {
    return new Promise(async (resolve, reject) => {
      for (let itr = 0; itr < this.appData.length; itr++) {
        if (this.appData[itr].id === folderId) {
          this.appData[itr].notes = this.appData[itr].notes.filter((note: any) => note.id !== noteId);
          break;
        }
      }
      await this.persisted();
      resolve(JSON.parse(JSON.stringify(this.appData)));
    });
  }

  public deleteFolder(deleteFolderAtId) {
    return new Promise(async (resolve, reject) => {
      this.appData = await this.appData.length &&
      this.appData.filter((folder) => folder.id !== deleteFolderAtId);
      await this.persisted();
      resolve(JSON.parse(JSON.stringify(this.appData)));
    });
  }
}

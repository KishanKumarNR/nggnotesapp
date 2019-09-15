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
          resolve(this.appData);
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
      resolve(this.appData);
    });
  }


  async createNoteItem(value, folderId) {
    return new Promise(async (resolve) => {
      let index = folderId - 1;
      let todoId = Array.isArray(this.appData[index].notes) ? this.appData[index].notes.length + 1 : 0;
      if (todoId) {
        this.appData[index].notes.push({
          id: todoId,
          data: value,
          type: "note",
          lastModifiedDate: new Date().toDateString()
        });
      }
      await this.persisted();
      resolve(this.appData);
    })
  }

  async createFolder(name) {
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
      return this.appData;
    });
  }

  async getNotesAsync() {
    await delay(200);
    await this.init();
    return {
      data: this.appData
    };
  }

  public deleteNote(folderId, noteId) {
    return new Promise(async (resolve, reject) => {
      let index = folderId - 1;
      let deleteNoteAtIndex = noteId - 1;
      await this.appData.length && this.appData[index].notes && this.appData[index].notes.length &&
      this.appData[index].notes.splice(deleteNoteAtIndex, 1);
      await this.persisted();
      resolve(this.appData);
    });
  }

  public deleteFolder(folderId) {
    return new Promise(async (resolve, reject) => {
      let deleteFolderAtIndex = folderId - 1;
      await this.appData.length && this.appData[deleteFolderAtIndex] &&
      this.appData.splice(deleteFolderAtIndex, 1);
      await this.persisted();
      resolve(this.appData);
    });
  }
}

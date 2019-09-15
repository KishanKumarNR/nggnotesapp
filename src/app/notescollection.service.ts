import { Injectable } from '@angular/core';
import {delay} from "q";

@Injectable({
  providedIn: 'root'
})
export class NotescollectionService {

  appData: any;

  constructor() {
    this.appData = [
      {
        id: 1,
        name: "default note",
        type: "folder",
        "notes": [
          {
            id: 1,
            type: "note",
            title: "default",
            "data": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris pretium, odio non dictum vulputate, augue augue euismod mi, sed sagittis turpis tellus vitae nunc. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Integer sodales turpis nec elit vestibulum porta vel nec neque. Aliquam erat volutpat. Sed sit amet nibh ante. Curabitur nibh elit, pharetra nec porta vel, ultrices quis urna. Sed eu mi sit amet metus porttitor aliquam vel tristique erat.\n",
            lastModifiedDate: new Date().toDateString()
          }
        ]
      }
    ];
  }

  async updateNote(folderId, noteId, data) {
    let folder = folderId-1;
    let note = noteId-1;
    this.appData[folder].notes[note].data = data;
    return this.appData;
  }


  async createTodoItem(value, folderId) {
    let index = folderId-1;
    let todoId = Array.isArray(this.appData[index].notes) ? this.appData[index].notes.length + 1 : 0;
    if (todoId) {
      this.appData[index].notes.push({
        id: todoId,
        data: value,
        type: "note",
        lastModifiedDate: new Date().toDateString()
      });
    }
    return this.appData;
  }

  async createFolder(name) {
    let length = this.appData.length + 1;
    let newFolder = {
      id: length,
      name: name,
      type: "folder",
      notes: []
    };
    this.appData.push(newFolder);
    return this.appData;
  }

  async getNotesAsync () {
    await delay(200);
    return {
      data: this.appData
    };
  }

  public deleteNote(folderId, noteId) {
    return new Promise(async (resolve, reject) => {
      let index = folderId - 1;
      let deleteNoteAtIndex = noteId- 1;
      await this.appData[index].notes && this.appData[index].notes.length &&
      this.appData[index].notes.splice(deleteNoteAtIndex, 1);
      resolve(this.appData);
    });
  }

  public deleteFolder(folderId) {
    return new Promise(async (resolve, reject) => {
      let deleteFolderAtIndex = folderId - 1;
      await this.appData.length && this.appData[deleteFolderAtIndex] &&
      this.appData.splice(deleteFolderAtIndex, 1);
      resolve(this.appData);
    });
  }
}

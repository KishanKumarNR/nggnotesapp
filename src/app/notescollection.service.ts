import { Injectable } from '@angular/core';
import {delay} from "q";

@Injectable({
  providedIn: 'root'
})
export class NotescollectionService {

  constructor() { }


  async getNotesAsync () {
    await delay(200);
    return {
      data: [
        {
          id: 1,
          name: "newnote",
          type: "folder",
          "items": [
            {
              title: "testnote1",
              "data": "String data"
            },
            {
              title: "testnote2",
              "data": "String data"
            }
          ]
        },
        {
          id: 2,
          name: "nextnote",
          type: "folder",
          "items": [
            {
              title: "testnote2",
              "data": "String data"
            }
          ]
        },
      ]
    };
  }

}

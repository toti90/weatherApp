import { Injectable } from '@angular/core';
import { NgxIndexedDB } from 'ngx-indexed-db';
import { User } from '../../Shared/Models/User';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

  constructor() { }

  private db = new NgxIndexedDB('myDb', 1);

  createObjStore() {
    return this.db.openDatabase(1, evt => {
      const objectStore = evt.currentTarget.result.createObjectStore('users', { keyPath: 'username' });
      objectStore.createIndex('username', 'username', { unique: true });
      objectStore.createIndex('password', 'password', { unique: false });
      objectStore.createIndex('selectedCities', 'selectedCities', { unique: false });
    });
  }

  getUser(formData) {
    return this.createObjStore()
      .then(() => this.db.getByIndex('users', 'username', formData.username)
        .then(
          user => {
            if (user === undefined) {
              return this.addUser(formData.username, formData.password);
            } else if (user.password === formData.password) {
              const responseUser: User = {
                username: user.username,
                selectedCities: user.selectedCities
              };
              return responseUser;
            } else {
              throw new Error('Incorrect password or username')
            }
          },
          error => {
            throw new Error('Can not find user');
          }
        ))
  }

  addUser(username: string, password: string) {
    return this.db.add('users', { username, password, selectedCities: [] }).then(
      () => {
        const responseUser: User = {
          username,
          selectedCities: []
        };
        return responseUser;
      },
      error => {
        throw new Error('Can not add new User');
      }
    );
  }
}

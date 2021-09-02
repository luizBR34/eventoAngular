import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class AuthenticatedUserService {

  localStorage: Storage;

  constructor() { 
    this.localStorage = window.localStorage;
  }


  addUser(key: string, value: Usuario): boolean {

    if (this.isLocalStorageSupported) {
      this.localStorage.setItem(key, JSON.stringify(value));
      console.log("The user: " + value.userName + " was added!");
      return true;
    }
    return false;
  }


  getUser(key: string) {
    if (this.isLocalStorageSupported) {
      return JSON.parse(this.localStorage.getItem(key));
    }
    return null;
  }


  removeUser(key: string): boolean {
    if (this.isLocalStorageSupported) {
      this.localStorage.removeItem(key);
      return true;
    }
    return false;
  }


  contains(user: Usuario): boolean {

    if (this.localStorage.indexOf(user) != -1) {
      return true;
    }

    return false;
  }


  logout() {
    this.localStorage.clear();
  }


  get isLocalStorageSupported(): boolean {
    return !!this.localStorage
  }
}

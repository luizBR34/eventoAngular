import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class ExchangeDataService {

  private loginLoading = new Subject<boolean>();
  private authorization = new BehaviorSubject<Usuario>(null);

  constructor() { }

  setFlag(status: boolean): void {
    this.loginLoading.next(status);
  }

  setUser(user: Usuario): void {
    this.authorization.next(user);
  }

  getUser(): Observable<Usuario> {
    return this.authorization.asObservable();
  }

  getBehaviorSubject(): BehaviorSubject<Usuario> {
    return this.authorization;
  }

  getSubject(): Subject<boolean> {
    return this.loginLoading;
  }
}

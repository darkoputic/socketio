import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import * as io from 'socket.io-client';
import * as Rx from 'rxjs';
import {environment} from '../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;
  wsURL = environment.wsURL;

  constructor() {
  }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io(this.wsURL);

    const observable = new Observable(observer => {
      this.socket.on('response', (data) => {
        observer.next(data);
      });

      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('signin', data);
      }
    };

    return Rx.Subject.create(observer, observable);
  }
}

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import * as io from 'socket.io-client';
import * as Rx from 'rxjs';
import {environment} from '../environments/environment.prod';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket; // socket that connects to our socket.io server
  wsURL = environment.wsURL;

  constructor() {
  }

  connect(): Rx.Subject<MessageEvent> {
    this.socket = io(this.wsURL);
    console.log(this.socket.id);

    const observable = new Observable(observer => {
      this.socket.on('response', (data) => {
        observer.next(data);
      });

      this.socket.on('connect', () => {
        console.log(this.socket.id);
        console.log(this.socket.connected);
      });

      this.socketErrorCheck();

      return () => {
        this.socket.disconnect();
      };
    });

    const observer = {
      next: (data: Object) => {
        this.socket.emit('signin', JSON.stringify(data));
      }
    };

    return Rx.Subject.create(observer, observable);
  }

  socketErrorCheck(): void {
    this.socket.on('error', (err) => {
      console.log('Error connecting to server', err);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnect from server');
      if (reason === 'io server disconnect') {
        this.socket.connect();
        console.log('connect to server');
      }
    });

    this.socket.on('reconnect', (number) => {
      console.log('Reconnected to server', number);
    });

    this.socket.on('reconnect_attempt', () => {
      console.log('Reconnect Attempt');
    });

    this.socket.on('reconnecting', (number) => {
      console.log('Reconnecting to server', number);
    });

    this.socket.on('reconnect_error', (err) => {
      console.log('Reconnect Error', err);
    });

    this.socket.on('reconnect_failed', () => {
      console.log('Reconnect failed');
    });

    this.socket.on('connect_error', () => {
      console.log('connect_error');
    });

    this.socket.on('ping', () => {
      console.log('ping');
    });

    this.socket.on('pong', (number) => {
      console.log('pong', number);
    });
  }
}

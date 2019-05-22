import {Component, OnInit} from '@angular/core';
import {ChatService} from './chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'socket-app';
  recivedMessage: any;

  constructor(private chat: ChatService) {
  }

  ngOnInit(): void {
    this.chat.messages.subscribe(msg => {
      this.recivedMessage = JSON.stringify(msg);
    });
  }

  sendMessage(): void {
    this.chat.sendMsg({email: 'test@mail.com', password: '1234'});
  }
}

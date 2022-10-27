import { Component, OnInit } from '@angular/core';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private socketService: SocketioService) { }

  ngOnInit(): void {
    this.socketService.setupSocketConnection();
  }

}

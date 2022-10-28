import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from 'src/utils/User.interface';
import { SocketioService } from '../socketio.service';


@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {
  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  list: Array<User> = [];
  users: Array<User> = [];

  constructor(
    private socketService: SocketioService
  ) {}

  ngOnInit(): void {
    this.socketService.listen('userList').subscribe((data) => {
      this.list = data
      this.users = this.list.filter(user => user.name != this.me.name)

      // console.log(this.list.filter(user => user.name != this.me.name));
    })
  }

}

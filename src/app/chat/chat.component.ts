import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Message } from 'src/utils/Message.inteface';
import { User } from 'src/utils/User.interface';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit  {
  @ViewChild('scrollMe', {read: ElementRef}) scroll!: ElementRef;

  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  list: Array<User> = [];
  users: Array<User> = [];
  messages: Array<Message> = [];

  constructor(
    private socketService: SocketioService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.socketService.listen('userList').subscribe((data) => {
      this.list = data
      this.users = this.list.filter(user => user.name != this.me.name)
    })
    this.socketService.listen('receiveMessage').subscribe(data => {
      console.log(data);
      this.messages.push(data)
    })
  }

  ngAfterViewChecked(): void {
    this.scroll.nativeElement.scrollTop =
    this.scroll.nativeElement.scrollHeight;
  }

  sendMessage(): void {
    console.log(this.scroll);
    
  }

  copyRoomId(): void {
    navigator.clipboard.writeText(this.me.room)
  }

  disconnect(): void {
    this.socketService.emit('leaveRoom', '')
    this.router.navigate(['/'])
  }
}

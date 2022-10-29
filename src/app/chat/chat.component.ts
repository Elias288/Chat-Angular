import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'src/utils/Message.inteface';
import { User } from 'src/utils/User.interface';
import { SocketioService } from '../socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit  {
  @ViewChild('scrollMe', {read: ElementRef}) scroll!: ElementRef;

  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  list: Array<User> = [];
  users: Array<User> = [];
  messages: Array<Message> = [];
  message: string = '';
  room: string = '';

  constructor(
    private socketService: SocketioService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.route.params.subscribe((params) => {
      if (sessionStorage.getItem('user')== null) {
        sessionStorage.setItem('user', JSON.stringify({ room: params['RoomId'] }))
        this.router.navigate(['/'])
      } else {
        this.room = params['RoomId']
        this.socketService.emit('join', { name: this.me.name, room: this.room });
      }
    })
  }

  ngOnInit(): void {
    this.socketService.listen('userList').subscribe((data) => {
      // console.log(data);
      this.list = data
      this.users = this.list.filter(user => user.name != this.me.name)
    })
    this.socketService.listen('receiveMessage').subscribe(data => {
      // console.log(data);
      this.messages.push(data)
    })
  }

  ngAfterViewChecked(): void {
    this.scroll.nativeElement.scrollTop =
    this.scroll.nativeElement.scrollHeight;
  }

  sendMessage(): void {
    const messageData: Message = { 
      room: this.room,
      author: this.me.name,
      content: this.message,
      time: new Date(Date.now()).getHours() + ':' + new Date(Date.now()).getMinutes() + ':' + new Date(Date.now()).getSeconds()
    }

    this.socketService.emit('sendMessage', messageData)

    this.messages.push(messageData)
    this.message = ''
  }

  copyRoomId(): void {
    navigator.clipboard.writeText(this.room)
  }

  disconnect(): void {
    this.socketService.emit('leaveRoom', '')

    sessionStorage.setItem('user', JSON.stringify({ name: this.me.name }))

    this.router.navigate(['/'])
  }
}

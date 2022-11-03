import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { Message } from 'src/utils/Message.inteface';
import { User } from 'src/utils/User.interface';
import { SocketioService } from '../../socketio.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit, AfterViewInit  {
  @ViewChild('scrollFrame', {static: false}) scrollFrame!: ElementRef;
  @ViewChild('textarea', {static: false}) textareaElement!: ElementRef;
  @ViewChildren('messageItem') messageItem!: QueryList<any>;

  private scrollContainer: any;
  private isNearBottom = true;
  private textarea: any;

  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  list: Array<User> = [];
  users: Array<User> = [];
  messages: Array<Message> = [];
  message: string = '';
  answer: undefined | Message;
  room: string = '';

  constructor(
    private socketService: SocketioService,
    private router: Router,
    private route: ActivatedRoute,
    private _snackBar: MatSnackBar,
  ) {
    this.route.params.subscribe((params) => {
      if (sessionStorage.getItem('user') == null) {
        sessionStorage.setItem('user', JSON.stringify({ room: params['RoomId'] }))
        this.router.navigate(['/'])
      } else {
        this.room = params['RoomId']
        this.socketService.emit('join', {
          personalId: this.me.personalId,
          name: this.me.name,
          room: this.room,
          // time: new Date().toTimeString().split(' ')[0]
        });
      }
    })
  }

  ngOnInit(): void {
    this.socketService.listen('error').subscribe((data) => {
      localStorage.setItem('error', JSON.stringify(data))
      this.router.navigate(['/'])
    })
    this.socketService.listen('userList').subscribe((data) => {
      // console.log(data);
      localStorage.removeItem('error')
      this.list = data
      this.users = this.list.filter(user => user.name != this.me.name)
    })
    this.socketService.listen('receiveMessage').subscribe(data => {
      localStorage.removeItem('error')
      data.time = new Date().toTimeString().split(' ')[0]
      // console.log(data)
      this.messages.push(data)
    })
  }

  ngAfterViewInit(): void {
    this.scrollContainer = this.scrollFrame.nativeElement;
    this.textarea = this.textareaElement.nativeElement;
    this.messageItem.changes.subscribe(_ => {
      this.scrollContainer.scroll({
        top: this.scrollContainer.scrollHeight,
        behavior: 'smooth'
      });
    }); 
  }

  scrolled(event: any): void {
    this.isNearBottom = this.isUserNearBottom();
  }

  private isUserNearBottom(): boolean {
    const threshold = 150;
    const position = this.scrollContainer.scrollTop + this.scrollContainer.offsetHeight;
    const height = this.scrollContainer.scrollHeight;
    return position > height - threshold;
  }

  sendMessage(): void {
    const messageData: Message = { 
      room: this.room,
      author: this.me.name,
      content: this.message,
      answer: this.answer,
      time: new Date().toTimeString().split(' ')[0]
    }
    
    if (messageData.content.trim() !== '') {
      this.socketService.emit('sendMessage', messageData)
      this.answer = undefined
      this.messages.push(messageData)
    }
    this.message = ''
    this.focusTextArea()
  }

  setAnswer(data: any) {
    this.answer = data;
    
    this.focusTextArea()
  }

  private focusTextArea() {
    setTimeout(()=>{
      this.textarea.focus();
    },0);
  }

  copyRoomUrl(): void {
    navigator.clipboard.writeText(window.location.href)
  }

  copyRoomId(): void {
    navigator.clipboard.writeText(this.room)
  }

  disconnect(): void {
    this.socketService.emit('leaveRoom', { time: new Date().toTimeString().split(' ')[0] })

    sessionStorage.setItem('user', JSON.stringify({ name: this.me.name, personalId: this.me.personalId }))

    this.router.navigate(['/'])
  }
}

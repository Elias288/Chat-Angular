import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, ActivatedRoute } from '@angular/router';
import { MessagesService } from 'src/app/services/messages.service';
import { UsersService } from 'src/app/services/users.service';
import { Message } from 'src/utils/Message.inteface';
import { User } from 'src/utils/User.interface';
import { SocketioService } from '../../services/socketio.service';

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
  // list: Array<User> = [];
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
    private userService: UsersService,
    private messagesService: MessagesService,
  ) {
    this.route.params.subscribe((params) => {
      if (sessionStorage.getItem('user') == null) {
        sessionStorage.setItem('user', JSON.stringify({ room: params['RoomId'].toLowerCase() }))
        this.router.navigate(['/'])
      }

      // this.room = params['RoomId']
      this.socketService.emit('join', {
        personalId: this.me.personalId,
        name: this.me.name,
        room: this.me.room,
      });
    })
  }

  ngOnInit(): void {
    this.socketService.listen('error').subscribe((data) => {
      localStorage.setItem('error', JSON.stringify(data))
      this.router.navigate(['/'])
    })

    this.socketService.listen('userList').subscribe((data: Array<User>) => {
      localStorage.removeItem('error')
      this.users = data.filter(user => user.name != this.me.name)
    })

    this.socketService.listen('receiveMessage').subscribe(data => {
      localStorage.removeItem('error')
      data.time = new Date().toTimeString().split(' ')[0]
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
    if (this.message.trim() !== '') {
      const msg = this.messagesService.sendMessage(this.room, this.me.name, this.message, this.answer)
      this.messages.push(msg)
      this.answer = undefined
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
    this.userService.logout()
  }
}

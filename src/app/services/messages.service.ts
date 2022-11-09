import { Injectable } from '@angular/core';
import { Message } from 'src/utils/Message.inteface';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class MessagesService {

  constructor(
    private socketService: SocketioService
  ) { }

  sendMessage(
    room: string,
    author: string,
    content: string,
    answer: undefined | Message
  ): Message {
    const message: Message = {
      room,
      author,
      content,
      answer,
      time: new Date().toTimeString().split(' ')[0]
    }
    this.socketService.emit('sendMessage', message)
    return message
  }
}

import { Injectable } from '@angular/core';
import { io } from 'socket.io-client';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: any

  constructor() { }

  setupSocketConnection() {
    console.log('connect?');
    
    this.socket = io(environment.SOCKET_ENDPOINT)
  }
}

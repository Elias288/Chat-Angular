import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../socketio.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/utils/User.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  uuid: string = uuidv4();
  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  
  name: string = this.me.name != undefined ? this.me.name : "guest-" + this.uuid.substring(0, 8);
  room: string = this.me.room != undefined ? this.me.room : this.uuid;
  checkedRoom: boolean;

  constructor(
    private router: Router
  ) {
    this.checkedRoom = false;
  }

  submit(): void {
    if (this.me.name == undefined || this.me.name == '' || this.me.name != this.name || this.me.room != this.room){
      sessionStorage.setItem('user', JSON.stringify({ name: this.name.trim().toLowerCase(), room: this.room }))
      this.me = { name: this.name.trim().toLowerCase(), room: this.room}
    }

    this.router.navigate(['/chat/',this.room ])
  }

  toggleDisabled(): void {
    this.checkedRoom = !this.checkedRoom;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }
}

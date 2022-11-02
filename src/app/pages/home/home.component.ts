import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../../socketio.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/utils/User.interface';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  uuid: string = uuidv4().replace(/-/g, '');
  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  error: string = localStorage.getItem('error') || '';
  checkedRoom: boolean;
  
  name: string = this.me.name == undefined ? "guest-" + this.uuid.substring(0, 8) : this.me.name ;
  room: string = this.me.room != undefined ? this.me.room : this.me.personalId != undefined ? this.me.personalId : this.uuid;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private socketService: SocketioService,
  ) {
    this.checkedRoom = false;
  }

  ngOnInit(): void {
    this.socketService.emit('leaveRoom', '')

    if (this.error !== undefined && this.error !== ""){
      this._snackBar.open(this.error, 'close');
      this.error = "";
    }
  }

  submit(): void {
    const name = this.name.trim().toLowerCase();
    const room = this.room.trim().toLowerCase();

    if (name == '' || name == undefined || this.me.name == '') {
      this._snackBar.open('Name cannot be empty', 'close');
      throw new Error('Name cannot be empty')
    }

    if (room == '' || room == undefined || this.me.room == '') {
      this._snackBar.open('Room cannot be empty', 'close');
      throw new Error('Name cannot be empty')
    }
    
    const user = {
      name: name.trim().toLowerCase(),
      personalId: this.me.personalId == undefined && this.me.room == undefined ? this.uuid : this.me.personalId,
      room: room.split(" ").join("")
    }

    sessionStorage.setItem('user', JSON.stringify(user))
    this.me = user

    this.router.navigate(['/chat/', this.me.room ])
  }

  toggleDisabled(): void {
    this.checkedRoom = !this.checkedRoom;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }
}

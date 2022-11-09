import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../../services/socketio.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/utils/User.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  uuid: string = uuidv4().replace(/-/g, '');

  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  name: string;
  personalId: string;
  room: string;
  
  error: string = localStorage.getItem('error') || '';
  checkedRoom: boolean = false;
  connected: boolean = this.me.room != undefined ? true : false;
  
  constructor(
    private _snackBar: MatSnackBar,
    private userService: UsersService
  ) {
    this.name = this.me.name == undefined 
      ? "guest-" + this.uuid.substring(0, 8) 
      : this.me.name;

    this.personalId = this.me.personalId != undefined 
      ? this.me.personalId 
      : this.uuid;

    this.room = this.me.room != undefined 
      ? this.me.room 
      : this.me.personalId != undefined 
        ? this.me.personalId 
        : this.uuid;
  }

  ngOnInit(): void {
    if (this.connected){ 
      this.userService.logout()
      console.log('desconectado')
    }

    if (this.error){
      this._snackBar.open(this.error, 'close');
      this.error = "";
    }
  }

  login(): void {
    this.userService.login(this.name, this.room, this.personalId)
  }

  toggleDisabled(): void {
    this.checkedRoom = !this.checkedRoom;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }
}

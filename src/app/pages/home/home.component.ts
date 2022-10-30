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
  uuid: string = uuidv4();
  me: User = JSON.parse(sessionStorage.getItem('user') || '{}');
  error: string = localStorage.getItem('error') || '';
  
  name: string = this.me.name != undefined ? this.me.name : "guest-" + this.uuid.substring(0, 8);
  room: string = this.me.room != undefined ? this.me.room : this.uuid;
  checkedRoom: boolean;

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar
  ) {
    this.checkedRoom = false;
  }

  ngOnInit(): void {
    if (this.error !== undefined && this.error !== ""){
      this._snackBar.open(this.error, 'close');
      this.error = "";
    }
  }

  submit(): void {
    if (this.me.name == undefined || this.me.name == '' || this.me.name != this.name || this.me.room != this.room){
      sessionStorage.setItem('user', JSON.stringify({ name: this.name.trim().toLowerCase(), room: this.room.split(" ").join("") }))
      this.me = { name: this.name.trim().toLowerCase(), room: this.room.split(" ").join("") }
    }

    this.router.navigate(['/chat/', this.me.room ])
  }

  toggleDisabled(): void {
    this.checkedRoom = !this.checkedRoom;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/utils/User.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class RoomService {
  uuid: string = uuidv4().replace(/-/g, '');
  room: string = this.uuid
  me: User = JSON.parse(sessionStorage.getItem('user') || '{}')

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  getInRoom(newRoom: string): void {
    if (!newRoom.trim()) {
      this._snackBar.open('Name cannot be empty', 'close');
      throw new Error('Room cannot be empty')
    }

    this.me.room = newRoom;
    sessionStorage.setItem('user', JSON.stringify(this.me))

    this.router.navigate(['/chat/', newRoom])
  }
}

import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/utils/User.interface';
import { SocketioService } from './socketio.service';
import { Location } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private socketService: SocketioService,
    private location: Location,
  ) {
    this.socketService.listen('error').subscribe((data) => {
      localStorage.setItem('error', JSON.stringify(data))
      this.location.back()
    })
  }

  login(name: string, room: string, personalId: string): void {
    if (!name.trim()) {
      const error = 'Name cannot be empty'
      this._snackBar.open(error, 'close');
      throw new Error('C - ' + error)
    }

    if (!room.trim()) {
      const error = 'Room cannot be empty'
      this._snackBar.open(error, 'close');
      throw new Error('C - ' + error)
    }

    const user: User = {
      name: name.trim().toLowerCase(),
      room: room.split(" ").join("").toLowerCase(),
      personalId,
    }

    sessionStorage.setItem('user', JSON.stringify(user))
    this.router.navigate(['/chat/', user.room])
  }

  isLogged(): boolean {
    const user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    return user.personalId?.length > 0
  }

  logout(): void {
    const user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    // user.personalId = ''
    user.room = undefined
    sessionStorage.setItem('user', JSON.stringify(user))
    this.socketService.emit('leaveRoom', '')
    this.router.navigate(['/'])
  }
}

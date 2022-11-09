import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { User } from 'src/utils/User.interface';
import { Location } from '@angular/common';
import { SocketioService } from './socketio.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  usersList: User[] = [];
  me: User = { name: '', personalId: '' };

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

  setMe(me: User): void {
    this.me = me
  }

  getUsers(): User[] {
    return this.usersList;
  }

  setUsers(users: User[]): User[] {
    return this.usersList = users.filter(user => user.name !== this.me.name)
  }

  login(name: string, personalId: string): void {
    if (!name.trim()) {
      this._snackBar.open('Name cannot be empty', 'close');
      throw new Error('Name cannot be empty')
    }

    const user: User = {
      name: name.toLowerCase(),
      personalId
    }

    this.socketService.emit('join', user)

    sessionStorage.setItem('user', JSON.stringify(user))
    this.router.navigate(['/home/'])
  }

  isLogged(): boolean {
    const user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    return user.personalId?.length > 0
  }

  logout(): void {
    const user: User = JSON.parse(sessionStorage.getItem('user') || '{}')
    user.personalId = ''
    sessionStorage.setItem('user', JSON.stringify(user))
  }
}

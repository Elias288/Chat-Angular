import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/utils/User.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  
  user: User = { name: '', personalId: '' };
  uuid: string = uuidv4().replace(/-/g, '');
  
  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
  ) { }

  login(name: string, personalId: string): void {
    if (!name) {
      this._snackBar.open('Name cannot be empty', 'close');
      throw new Error('Name cannot be empty')
    }

    this.user = {
      name,
      personalId: personalId === '' ? this.uuid : personalId,
      room: undefined
    }

    console.log(this.user)

    sessionStorage.setItem('user', JSON.stringify(this.user))
    this.router.navigate(['/home/'])
  }

  isLogged(): boolean {
    return sessionStorage.getItem('user') != undefined ? true : false
  }

  logout(): void {
    sessionStorage.removeItem('user')
    this.user = { name: '', personalId: '', room: undefined }
    this.router.navigate(['/'])
    window.location.reload()
  }
}

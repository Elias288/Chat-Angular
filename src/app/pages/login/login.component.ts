import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  uuid: string = uuidv4().replace(/-/g, '');
  me = JSON.parse(sessionStorage.getItem('user') || '{}')
  checkedRoom: boolean = false;
  name: string 
  error: string = localStorage.getItem('error') || '';

  constructor(
    private router: Router,
    private _snackBar: MatSnackBar,
    private userService: UserService,
  ) {
    this.name = this.me.name == undefined 
      ? "guest-" + this.uuid.substring(0, 8) 
      : this.me.name;
  }

  ngOnInit(): void {
    if (this.error){
      this._snackBar.open(this.error, 'close');
      this.error = "";
    }
  }

  login(): void {
    this.userService.login(this.name, this.uuid)
  }

  toggleDisabled(): void {
    this.checkedRoom = !this.checkedRoom;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }

}

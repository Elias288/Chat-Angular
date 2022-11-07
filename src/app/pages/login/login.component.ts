import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketioService } from '../../services/socketio.service';
import { v4 as uuidv4 } from 'uuid';
import { User } from 'src/utils/User.interface';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  
  uuid: string = uuidv4().replace(/-/g, '');
  checkedRoom: boolean = false;
  name: string = this.LoginService.user.name == undefined 
    ? "guest-" + this.uuid.substring(0, 8) 
    : this.LoginService.user.name;

  constructor(
    private router: Router,
    private LoginService: LoginService,
  ) { }

  ngOnInit(): void {
    if (this.LoginService.isLogged()) {
      this.router.navigate(['/home/'])
    }
  }

  submit(): void {
    this.LoginService.login(this.name, this.uuid)
  }

  toggleDisabled(): void {
    this.checkedRoom = !this.checkedRoom;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }

}

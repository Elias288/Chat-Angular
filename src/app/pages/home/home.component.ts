import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RoomService } from 'src/app/services/room.service';
import { SocketioService } from 'src/app/services/socketio.service';
import { UserService } from 'src/app/services/user.service';
import { User } from 'src/utils/User.interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /**
   * TODO: Home page with list of connected users
   * TODO: Connect to personalId and create chat groups
   * TODO: Access only if logged
   */
 
  me: User = JSON.parse(sessionStorage.getItem('user') || '{}')
  users: Array<User> = []

  room: string = ''
  checkedRoom: boolean = false;

  constructor(
    private router: Router,
    private socketService: SocketioService,
    private _snackBar: MatSnackBar,
    private userService: UserService,
    private roomService: RoomService,
  ) {
    this.userService.setMe(this.me)
    this.room = this.roomService.room
   }

  ngOnInit(): void {
    localStorage.removeItem('error')

    if (this.userService.me.room != undefined) {
      this.socketService.emit('leaveRoom', '')
    }
    
    this.socketService.listen('userList').subscribe((data) => {
      this.users = this.userService.setUsers(data)
    })
  }

  GetInRoom() {
    // this.roomService.getInRoom(this.room)
  }

  logout() {
    this.userService.logout()
    this.socketService.emit('leave', '')
    this.router.navigate(['/'])
  }

  toggleDisabled(): void {
    this.checkedRoom = !this.checkedRoom;
  }

  selectAllContent($event: any) {
    $event.target.select();
  }
}

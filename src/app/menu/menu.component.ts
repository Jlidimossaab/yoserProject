import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/User';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{

  @Input() categories: any[]=[];
  user?: User
  isloggedIn = false;
  display: boolean = false;
  @Output() selectedCategoryId = new EventEmitter();

  constructor(private loginService: LoginService,private router:Router){
    
  }
  ngOnInit(): void {
    this.loginService.getLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        // Close the dialog when the user is logged in
        this.isloggedIn = loggedIn;
      }
    });

    this.loginService.currentUser.subscribe(user => {
      this.user = user!;
    });
  }
  ngOnChange(){
    this.display = false;
  }

  logout() {
    this.isloggedIn = false;
    this.loginService.clearCurrentUser();
    this.loginService.setCurrentUser(null);
    this.loginService.setLoggedIn(false);
    this.router.navigate([`/`]);
  }

  showDialog() {
    this.display = true;
  }

  onCategoryClick(categoryId : number){
    this.selectedCategoryId.next(categoryId);
  }

  onLoginHandle(event : any){
    this.display = event;
  }

}

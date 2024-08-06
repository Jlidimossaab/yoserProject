import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CategoryService } from 'src/services/category.service';
import { PrimeNGConfig } from 'primeng/api';
import { LoginService } from 'src/services/login.service';
import { User } from 'src/models/User';
import { Router } from '@angular/router';
import { MarkerService } from 'src/services/marker.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  categories: any[] = [];
  user?: User;
  selectedCategoryId?: number;
  destinations?: any[];
  display: boolean = false;
  isloggedIn = false;
  selectedDestination?: any;
  selectedDestinationChange?: any;

  constructor(private categoryService: CategoryService, private primengConfig: PrimeNGConfig, public loginService: LoginService, private router: Router,private markerService:MarkerService) { }

  ngOnInit() {

    // Subscribe to changes in the current user
    this.loginService.currentUser.subscribe(user => {
      this.user = user!;
      // Perform any other actions based on the current user, if needed
    });
    this.loginService.getLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        // Close the dialog when the user is logged in
        this.isloggedIn = loggedIn;
      }
    });

    this.loginService.currentUser.subscribe(user => {
      this.user = user!;
    });
    this.primengConfig.ripple = true;
    this.getAllCategory();
    console.log("carooot", this.categories);

  }
  ngOnChange() {
    this.display = false;
  }

  onLoginHandle(event: any) {
    this.display = event;
  }

  logout() {
    this.isloggedIn = false;
    this.loginService.clearCurrentUser();
    this.loginService.setCurrentUser(null);
    this.loginService.setLoggedIn(false);
    this.router.navigate(['/']).then(() => {
      window.location.reload();
    });
  }

  showDialog() {
    this.display = true;
  }

  getAllCategory() {
    this.categoryService.getAllCategory().subscribe((response) => {
      this.categories = response;
    });
  }
  handleCategoryId(event: any) {
    this.selectedCategoryId = event;
  }
  handleDestinations(event: any){
    this.destinations = event;
  }
  handleDestinationChanges(event: any){
    this.selectedDestination = event;
  }

  handleSelectedDestinationChange(event: any){
    this.selectedDestinationChange = event;

  }
}

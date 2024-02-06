import { Component, Input, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CategoryService } from 'src/services/category.service';
import { PrimeNGConfig } from 'primeng/api';
import { LoginService } from 'src/services/login.service';
import { User } from 'src/models/User';

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

  constructor(private categoryService: CategoryService,private primengConfig: PrimeNGConfig,public loginService: LoginService,) { }
  
  ngOnInit() {

    // Subscribe to changes in the current user
    this.loginService.currentUser.subscribe(user => {
      this.user = user!;
      // Perform any other actions based on the current user, if needed
    });
    this.primengConfig.ripple = true;
    this.getAllCategory();
    
  }
  ngOnChange(){
   
  }
  getAllCategory() {
    this.categoryService.getAllCategory().subscribe((response) => {
      this.categories = response;
    });
    console.log("categories:" + this.categories);
  }
  handleCategoryId(event: any) {
    this.selectedCategoryId = event;
  }
}

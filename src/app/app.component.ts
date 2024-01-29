import { Component, OnInit, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { CategoryService } from 'src/services/category.service';
import { PrimeNGConfig } from 'primeng/api';
import { LoginService } from 'src/services/login.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  categories: any[] = [];
  selectedCategoryId: any;
  display: boolean = false;
  isloggedIn = false;

  constructor(private categoryService: CategoryService,private primengConfig: PrimeNGConfig,public loginService: LoginService,) { }
  
  ngOnInit() {
    this.loginService.getLoggedIn().subscribe((loggedIn) => {
      if (loggedIn) {
        // Close the dialog when the user is logged in
        this.isloggedIn = loggedIn;
        this.display = false;
      }
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

  onCategoryClick(categoryId: number) {
    this.selectedCategoryId = categoryId;
  }

  showDialog() {
    this.display = true;
  }

  logout() {
    this.isloggedIn = false;
    this.loginService.setLoggedIn(false);
  }
}

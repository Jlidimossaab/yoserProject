import { Component, OnInit, SimpleChanges } from '@angular/core';
import { CategoryService } from 'src/services/category.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  categories:any[]= [];
  selectedCategoryId: any;
  constructor(private categoryService:CategoryService){}
  
  ngOnInit(){
    this.getAllCategory();
  }
  getAllCategory(){
    this.categoryService.getAllCategory().subscribe((response)=>{
      this.categories = response;
    });
    console.log("categories:" + this.categories);
  }
}

import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/services/category.service';
import { MarkerService } from 'src/services/marker.service';

@Component({
  selector: 'app-consulter-location',
  templateUrl: './consulter-location.component.html',
  styleUrls: ['./consulter-location.component.css']
})
export class ConsulterLocationComponent implements OnInit{
  selectedCategoryId: any;
  categories:any[]=[];
  addLocation= false;
  display =false;
  constructor(private categoryService: CategoryService,private markerService: MarkerService){

  }
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories(){
    this.categoryService.getAllCategory().subscribe((result)=>{
      if(result){
        this.categories = result;
      }
    })
  }

  onAddClick(){
    this.addLocation = !this.addLocation;
  }

  handleAddEvent(event:any){
    this.display = event;
  }

}

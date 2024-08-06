import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/models/User';
import { LoginService } from 'src/services/login.service';
import { MarkerService } from 'src/services/marker.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit{
  //presentation
  colors: string[] = [
    '#007bff', // Blue
    '#28a745', // Green
    '#dc3545', // Red
    '#ffc107', // Yellow
    '#17a2b8', // Cyan
    '#6610f2', // Purple
    // Add more colors as needed
  ];
  //end categories
  
  @Input() categories: any[]=[];
  user?: User
  @Output() selectedCategoryId = new EventEmitter();
  @Output() destinations = new EventEmitter();

  constructor(private markerService:MarkerService){
    
  }
  ngOnInit(): void {
  }
  ngOnChange(){
    
  }
  onCategoryClick(categoryId : number){
    this.selectedCategoryId.next(categoryId);
    this.getDestinations(categoryId);
  }

  getRandomColor(): string {
    console.log("color randomm")
    return '#' + Math.floor(Math.random() * 16777215).toString(16);
  }

  getDestinations(categoryId: number){
    this.markerService.getLocations(categoryId).subscribe((result) => {
      this.destinations.emit(result);
    })
  }
}

import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Category } from 'src/models/Category';
import { Marker } from 'src/models/Marker';
import { CategoryService } from 'src/services/category.service';
import { OpenRouteService } from 'src/services/map-service.service';
import { MarkerService } from 'src/services/marker.service';
import { MapComponent } from '../map/map.component';

@Component({
  selector: 'app-consulter-location',
  templateUrl: './consulter-location.component.html',
  styleUrls: ['./consulter-location.component.css']
})
export class ConsulterLocationComponent implements OnInit {
  selectedCategoryId: any;
  categories: any[] = [];
  addLocation = false;
  display = false;
  imageUrl: any;
  lat: any;
  lng: any;

  constructor(private categoryService: CategoryService, private markerService: MarkerService,private openRouteService: OpenRouteService) {

  }
  ngOnInit(): void {
    this.getAllCategories();
  }

  getAllCategories() {
    this.categoryService.getAllCategory().subscribe((result) => {
      if (result) {
        this.categories = result;
      }
    })
  }

  onAddClick() {
    this.addLocation = !this.addLocation;
  }

  handleAddEvent(event: any) {
    this.display = event.display;
    this.lat = event.lat;
    this.lng = event.lng;
  }

  onFileChange(event: any) {

  }
  submitLocation() {
    if (this.selectedCategoryId != null) {
      this.categoryService.getCategoryById(this.selectedCategoryId).subscribe(
        (category: Category) => {
          let marker = new Marker();
          marker.lat = this.lat;
          marker.lon = this.lng;
          marker.category = category;
          console.log("markerrr =>")
          console.log(marker)
          
          this.markerService.createMarker(marker).subscribe(
            () => {
              this.openRouteService.setMapInitializer(true);
              this.display=false;
              console.log("successfully saved")
            },
            (error) => {
              console.error('Error creating marker:', error);
              // Handle error
            }
          );
        },
        (error) => {
          console.error('Error fetching category:', error);
          // Handle error
        }
      );
    }

  }

  cancelLocation() {
    this.display = false;
  }
}

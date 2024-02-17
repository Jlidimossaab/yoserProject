import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Category } from 'src/models/Category';
import { Marker } from 'src/models/Marker';
import { CategoryService } from 'src/services/category.service';
import { OpenRouteService } from 'src/services/map-service.service';
import { MarkerService } from 'src/services/marker.service';
import { MapComponent } from '../map/map.component';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-consulter-location',
  templateUrl: './consulter-location.component.html',
  styleUrls: ['./consulter-location.component.css']
})
export class ConsulterLocationComponent implements OnInit {
  selectedCategoryId: any;
  categories: any[] = [];
  addLocation = false;
  deleteLocation = false;
  display = false;
  imageUrl: any;
  lat: any;
  lng: any;

  constructor(private categoryService: CategoryService, private markerService: MarkerService,private openRouteService: OpenRouteService,private messageService: MessageService) {

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
    if(!this.deleteLocation){
      this.addLocation = !this.addLocation;
    }else{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'You\'re currently trying to delete a location'});
    }
    
  }

  onDeleteClick(){
    if(!this.addLocation){
      this.deleteLocation = !this.deleteLocation;
    }else{
      this.messageService.add({severity:'error', summary: 'Error', detail: 'You\'re currently trying to add a location'});
    }

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
              this.messageService.add({ severity: 'success', summary: 'Success', detail: 'marker is added Successfully!' });
            },
            (error) => {
            }
          );
        },
        (error) => {
        }
      );
    }

  }

  cancelLocation() {
    this.display = false;
  }
}

import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Category } from 'src/models/Category';
import { Marker } from 'src/models/Marker';
import { CategoryService } from 'src/services/category.service';
import { OpenRouteService } from 'src/services/map-service.service';
import { MarkerService } from 'src/services/marker.service';
import { MapComponent } from '../map/map.component';
import { MessageService, SelectItem } from 'primeng/api';
import { Circuit } from 'src/models/Circuit';
import { CircuitService } from 'src/services/circuit.service';
import { Level } from 'src/models/Level';
import { latLng } from 'leaflet';
import L from 'leaflet';

@Component({
  selector: 'app-consulter-location',
  templateUrl: './consulter-location.component.html',
  styleUrls: ['./consulter-location.component.css']
})
export class ConsulterLocationComponent implements OnInit {
  circuitLocationOnAdd?: Marker[] = [];
  @ViewChild(MapComponent) mapComponent!: MapComponent;

  selectedCategoryId: any;
  selecttedLevel?: any;
  categories: any[] = [];
  addLocation = true;
  deleteLocation = false;
  display = false;
  imageUrl: any;
  levels?: SelectItem[];
  fileToUpload?: any;

  constructor(private categoryService: CategoryService, private circuitService: CircuitService, private openRouteService: OpenRouteService, private messageService: MessageService) {
    this.levels = Object.keys(Level).map(key => ({
      label: Level[key as keyof typeof Level],
      value: Level[key as keyof typeof Level]
    }));
  }
  ngOnInit(): void {
    this.getAllCategories();
    this.addLocation = true;
  }

  getAllCategories() {
    this.categoryService.getAllCategory().subscribe((result) => {
      if (result) {
        this.categories = result;
      }
    })
  }

  onAddClick() {
    if (!this.deleteLocation) {
      this.addLocation = !this.addLocation;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You\'re currently trying to delete a location' });
    }

  }

  onDeleteClick() {
    if (!this.addLocation) {
      this.deleteLocation = !this.deleteLocation;
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'You\'re currently trying to add a location' });
    }

  }

  handledestinationLocationOnAddEvent(event: any) {
    this.circuitLocationOnAdd = event;
  }

  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.fileToUpload = fileList[0];
    }
  }
  /* submitLocation() {
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
              this.display = false;
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

  } */
  submitCircuit() {
    let circuit = new Circuit();
    let category = new Category();
    circuit.level = this.selecttedLevel!.label;
    category = this.selectedCategoryId;
    circuit.category = category;
    circuit.markers = this.circuitLocationOnAdd!;
   
    if (this.circuitLocationOnAdd?.length != 0) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('circuit', JSON.stringify(circuit));

      this.circuitService.createCircuit(formData).subscribe(
        () => {
          this.display = false;
          this.openRouteService.setMapInitializer(true);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'marker is added Successfully!' });

        },
        (error) => {
        }
      );
    }
  }

  submitLocationPopup() {
    this.display = true;
  }

  cancelLocationPopup() {
    this.display = false;
  }

  cancelLocation() {
    if(this.circuitLocationOnAdd?.length!=0){
      this.mapComponent.cancelLocation();
    }
  }
  revertCircuit(){
    if(this.circuitLocationOnAdd?.length! ==1){
      this.mapComponent.removeMarker(this.circuitLocationOnAdd![0]);
      this.circuitLocationOnAdd!.pop();

    }else{
      const marker1L = L.marker([this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -1].lat!, this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -1].lon!])
      const marker2L = L.marker([this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -2].lat!, this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -2].lon!])
      const latLngs = [marker1L.getLatLng(), marker2L.getLatLng()];
      this.mapComponent.removePolyline(latLngs);
      this.mapComponent.addMarker(this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -2]);
      this.mapComponent.removeMarker(this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -1]);
      this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -2].isVisible= true;
      this.circuitLocationOnAdd![this.circuitLocationOnAdd!.length -2].markerSup = undefined;
      this.circuitLocationOnAdd!.pop();
    }
    

  }
  isDisabled(){
    if(this.circuitLocationOnAdd?.length!>0){
      return false;
    }
    return true;
  }

  
}

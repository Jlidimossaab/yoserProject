import { Component, OnInit, ViewChild } from '@angular/core';
import { Marker } from 'src/models/Marker';
import { ConsulterLocationComponent } from '../consulter-location/consulter-location.component';
import { CategoryService } from 'src/services/category.service';
import { Level } from 'src/models/Level';
import { Circuit } from 'src/models/Circuit';
import { Category } from 'src/models/Category';
import { MessageService } from 'primeng/api';
import { CircuitService } from 'src/services/circuit.service';

@Component({
  selector: 'app-manage-circuit-tab',
  templateUrl: './manage-circuit-tab.component.html',
  styleUrls: ['./manage-circuit-tab.component.css']
})
export class ManageCircuitTabComponent implements OnInit {
  @ViewChild(ConsulterLocationComponent) consulterLocationComponent!: ConsulterLocationComponent;
  categories: any[] = [];
  levels: any[] = [];
  selectedCategoryId: any;
  selecttedLevel?: any;
  display = false;
  imageUrl: any;
  fileToUpload: any;

  constructor(private categoryService: CategoryService, private messageService: MessageService, private circuitService: CircuitService) {
    this.levels = Object.keys(Level).map(key => ({
      label: Level[key as keyof typeof Level],
      value: Level[key as keyof typeof Level]
    }));
  }
  ngOnInit(): void {
    this.getAllCategories();
  }

  markerList: Marker[] = [];

  // Function to add a new marker to the list
  addMarker() {
    this.markerList.push(new Marker());
  }
  removeMarker() {
    this.markerList.pop();
  }
  onAddClick() {
    const newMarker = new Marker();
    this.markerList.push(newMarker);
  }
  getAllCategories() {
    this.categoryService.getAllCategory().subscribe((result) => {
      if (result) {
        this.categories = result;
      }
    })
  }
  manageCircuit(circuit: Circuit) {

    let category = new Category();
    circuit.level = this.selecttedLevel!.label;
    category = this.selectedCategoryId;
    circuit.category = category;

    for (let i = 0; i <= this.markerList.length - 1; i++) {
      if (i == 0) {
        this.markerList[i].isStartMarker = true;
        this.markerList[i].isVisible = true;
        this.markerList[i].markerSup = this.markerList[i + 1];
      } else if (i == this.markerList.length - 1) {
        this.markerList[i].isVisible = true;
      } else {
        this.markerList[i].isVisible = false;
        this.markerList[i].markerSup = this.markerList[i + 1];
      }
    }
    circuit.markers = this.markerList!;
    console.log("markerList>>",this.markerList);
    console.log("circuit>>",circuit);
  }
  submitCircuit() {
    let circuit = new Circuit();
    this.manageCircuit(circuit);

    if (this.markerList?.length != 0) {
      const formData = new FormData();
      formData.append('file', this.fileToUpload);
      formData.append('circuit', JSON.stringify(circuit));
      this.circuitService.createCircuit(formData).subscribe(
        () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'marker is added Successfully!' });

        },
        (error) => {
        }
      );
    }
  }
  onFileChange(event: any) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      this.fileToUpload = fileList[0];
    }
  }
  submitLocationPopup() {
    this.display = true;
  }

  cancelLocationPopup() {
    this.display = false;
  }
  
}

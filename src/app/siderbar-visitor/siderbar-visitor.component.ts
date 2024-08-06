import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { MarkerService } from 'src/services/marker.service';

@Component({
  selector: 'app-siderbar-visitor',
  templateUrl: './siderbar-visitor.component.html',
  styleUrls: ['./siderbar-visitor.component.css']
})
export class SiderbarVisitorComponent implements OnInit {
  @Input() categories?: any[];
  selectedDestination?: number;
  @Input() destinations?: any[] = [];
  @Input() selectedDestinationChange?: any;
  @Output() selectionChange: EventEmitter<any> = new EventEmitter<any>();

  constructor() {

  }
  ngOnInit() {
  }
  ngOnChanges(changes: SimpleChanges) {
    if (changes['selectedDestinationChange']) {
      // Assuming selectedDestinationChange is of type { LatLng: { lat: number, lng: number } }
      if (changes['selectedDestinationChange']) {
        const selectedLatLng = this.selectedDestinationChange?._latlng;
        console.log("selectedDestinationChange",this.selectedDestinationChange);
        console.log("selectedLatLng",selectedLatLng);
        if (selectedLatLng) {
          const selectedLat = selectedLatLng.lat;
          const selectedLng = selectedLatLng.lng;

          console.log("selectedLat",selectedLatLng.lat);
          console.log("selectedLng",selectedLatLng.lng);

          this.destinations?.forEach(des => {
            if (des.lat === selectedLat && des.lon === selectedLng) {
              console.log("Matching destination found:", des);
              this.selectedDestination = des;
            }
          });
        }
      }

    }

  }
  onChangeSelection(event: any) {
    console.log("selectedDestination=<", this.selectedDestination);
    this.selectionChange.emit(event);
  }

}

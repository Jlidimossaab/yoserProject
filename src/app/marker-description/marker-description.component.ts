import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Marker } from 'leaflet';
import { MarkerService } from 'src/services/marker.service';

@Component({
  selector: 'app-marker-description',
  templateUrl: './marker-description.component.html',
  styleUrls: ['./marker-description.component.css']
})
export class MarkerDescriptionComponent implements OnInit {

  @Input() marker?: any;
  markerImage: any;
  constructor(private markerService: MarkerService) {

  }

  ngOnInit(): void {
    // this.displayMarkerImage(this.marker);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['marker']) {
      this.displayMarkerImage(this.marker);
    }
  }

  displayMarkerImage(marker: any) {
    this.markerService.getMarkerFile(marker).subscribe(
      (imageUrl: string | null) => {
        this.markerImage = imageUrl;
      },
      (error) => {
        this.markerImage = null;
      }
    );
  }
}

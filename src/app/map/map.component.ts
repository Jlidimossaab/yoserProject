import { Component, ElementRef, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { OpenRouteService } from '../../services/map-service.service';
import { MarkerService } from 'src/services/marker.service';
import { Marker } from 'src/models/Marker';
import { CategoryService } from 'src/services/category.service';
import { LoginService } from 'src/services/login.service';
import { User } from 'src/models/User';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: L.Map | undefined;
  popup: L.Popup | undefined;
  @Output() display = new EventEmitter<boolean>();

  routingControl?: L.Routing.Control;
  modelMarkers?: any[] = [];
  customIcon: any;
  @Input() isAddLocation?: boolean;
  @Input() selectedCategoryId: any;
  constructor(private markerService: MarkerService, private loginService: LoginService) { }

  ngOnInit(): void {

    this.customIcon = L.icon({
      iconUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    if (!this.map) {
      this.initializeMap();
    }
  }
  ngOnChanges(changes: SimpleChanges) {
    // Check if the selectedCategoryId has changed
    if (changes['selectedCategoryId'] && !changes['selectedCategoryId'].firstChange) {
      // Call your method with the new selectedCategoryId
      this.getMarkers(this.selectedCategoryId);
    }

    this.addLocation();
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([36.97245540377546, 9.070844650268556], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map!);

    // Additionally, disable map dragging
    //this.map.dragging.disable();
  }

  async getRoute(desiredLocation: any) {
    // Remove existing routing control if it exists
    if (this.routingControl) {
      this.map!.removeControl(this.routingControl);
    }

    let marker = await this.getUserLocation();
    // Coordinates for waypoints within Nefza, Tunisia

    // Create a new routing control
    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(marker.lat!, marker.lon!),
        L.latLng(desiredLocation.lat, desiredLocation.lon),
      ],
      routeWhileDragging: false,
      addWaypoints: false,
      lineOptions: {
        styles: [{ color: '#242c81', weight: 2 }],
        extendToWaypoints: false,
        missingRouteTolerance: 0,
      },
    }).addTo(this.map!);

    this.map!.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.dragging!.disable();
        layer.setIcon(this.customIcon);
      }
    });
    this.map!.invalidateSize();
  }


  getMarkers(event: any) {
    // Clear existing markers
    this.map!.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map!.removeLayer(layer);
      }
    });

    this.markerService.getLocationsByCategory(event).subscribe((result) => {
      this.modelMarkers = result;

      for (const marker of this.modelMarkers!) {
        L.marker([marker.lat, marker.lon], { icon: this.customIcon })
          .addTo(this.map!)
          .bindPopup('Marker')
          .on('click', () => {
            this.getRoute(marker); // Call getRoute when marker is clicked
          });

      }
    });
    this.map!.invalidateSize();
  }

  private async getUserLocation(): Promise<Marker> {
    return new Promise((resolve, reject) => {
      if (navigator.geolocation) {
        const options: PositionOptions = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userCoordinates: [number, number] = [
              position.coords.latitude,
              position.coords.longitude
            ];

            this.map?.setView(userCoordinates, 14);

            const marker = L.marker(userCoordinates, { icon: this.customIcon })
              .addTo(this.map!)
              .bindPopup('Your Location')
              .openPopup();
            this.map!.invalidateSize();
            const resultMarker = new Marker();
            resultMarker.lat = userCoordinates[0];
            resultMarker.lon = userCoordinates[1];
            console.log("&&&&&&&&" + resultMarker.lat);
            resolve(resultMarker);
          },
          (error) => {
            console.error('Error getting user location:', error.message);
            reject(error);
          },
          options
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        reject('Geolocation not supported');
      }
    });
  }

  async getMarkersOfMap() {
    // You can customize the markers if needed, e.g., set an icon
    const customIcon = L.icon({
      iconUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    this.map!.eachLayer(function (layer) {
      if (layer instanceof L.Marker) {
        layer.dragging!.disable();
        layer.setIcon(customIcon);
      }
    });
  }

  addLocation() {
    if (this.isAddLocation) {
      // Attach event listeners for mouse movement and click
      this.map!.on('mousemove', this.onMouseMove);
      this.map!.on('mouseout', this.onMouseOut);
      this.map!.on('click', this.onClick);
    } else {
      // Remove event listeners if isAddLocation is false
      this.map!.off('mousemove', this.onMouseMove);
      this.map!.off('mouseout', this.onMouseOut);
      this.map!.off('click', this.onClick);
      // Close the popup if it exists
      if (this.popup) {
        this.map?.closePopup(this.popup);
        this.popup = undefined;
      }
    }
  }
  
  onMouseMove = (e: L.LeafletMouseEvent) => {
    const latlng = e.latlng;
    const lat = latlng.lat.toFixed(6);
    const lng = latlng.lng.toFixed(6);
  
    if (!this.popup) {
      this.popup = L.popup()
        .setLatLng(latlng)
        .setContent(`Latitude: ${lat}<br>Longitude: ${lng}`)
        .openOn(this.map!);
    } else {
      this.popup.setLatLng(latlng).setContent(`Latitude: ${lat}<br>Longitude: ${lng}`);
    }
  };
  
  onMouseOut = () => {
    if (this.popup) {
      this.map?.closePopup(this.popup);
      this.popup = undefined;
    }
  };
  
  onClick = (e: L.LeafletMouseEvent) => {
    this.display.next(true);
  };
  

}

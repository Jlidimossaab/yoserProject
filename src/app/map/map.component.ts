import { Component, ElementRef, Input, OnInit, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { OpenRouteService } from '../service/map-service.service';
import { MarkerService } from 'src/services/marker.service';
import { Marker } from 'src/models/Marker';
import { CategoryService } from 'src/services/category.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: L.Map | undefined;
  routingControl?: L.Routing.Control;
  modelMarkers?:any[]=[];
  customIcon:any;
  @Input() selectedCategoryId:any;

  constructor(private markerService: MarkerService) {}

  async ngOnInit(): Promise<void> {

    this.customIcon = L.icon({
      iconUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
    });

    this.initializeMap();
    
    // Add a click event listener to the map
    this.map!.on('click', (e: any) => {
      console.log('Latitude:', e.latlng.lat);
    console.log('Longitude:', e.latlng.lng);
    });
  }
  async ngOnChanges(changes: SimpleChanges) {
    // Check if the selectedCategoryId has changed
    if (changes['selectedCategoryId'] && !changes['selectedCategoryId'].firstChange) {
      // Call your method with the new selectedCategoryId
      this.getMarkers(this.selectedCategoryId);
    }
    let resultMarker = await this.getUserLocation();
    this.getRoute(resultMarker);
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([36.97245540377546,  9.070844650268556], 15);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map!);
    
    // Additionally, disable map dragging
    //this.map.dragging.disable();
  }

  getRoute(marker:Marker){
    // Coordinates for waypoints within Nefza, Tunisia
    const desiredLatitude = 36.973603980466855;
    const desiredLongitude = 9.068908095359804;
    console.log("markerlat"+marker.lat)
    // Create a routing control
    this.routingControl = L.Routing.control({
      waypoints: [
        L.latLng(marker.lat!, marker.lon!),
        L.latLng(desiredLatitude, desiredLongitude)
      ],
      routeWhileDragging: false,
      addWaypoints: false, 
      lineOptions: {
        styles: [{ color: '#242c81', weight: 2 }],
        extendToWaypoints: false,
        missingRouteTolerance: 0
      },
    }).addTo(this.map!);
    

    this.map!.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        layer.dragging!.disable();
        layer.setIcon(this.customIcon);
      }
    });
  }

  getMarkers(event: any) {
    // Clear existing markers
    this.map!.eachLayer((layer) => {
      if (layer instanceof L.Marker) {
        this.map!.removeLayer(layer);
      }
    });
  
    this.markerService.getAllMarker(event).subscribe((result) => {
      this.modelMarkers = result;
  
      for (const marker of this.modelMarkers!) {
        const customLayer = L.marker([marker.lat, marker.lon], { icon: this.customIcon }).addTo(this.map!);
        customLayer.bindPopup('Marker');
      }
    });
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
  
  

  
}

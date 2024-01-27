import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { OpenRouteService } from '../service/map-service.service';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  map: L.Map | undefined;

  constructor(private openRouteService: OpenRouteService) {}

  ngOnInit(): void {
    this.initializeMap();
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([36.4530, 9.0384], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(this.map);

    // Coordinates for waypoints within Nefza, Tunisia
    const yourCurrentLatitude = 8.681495;
    const yourCurrentLongitude = 49.41461;
    const desiredLatitude = 8.687872;
    const desiredLongitude = 49.420318;
    
   
    this.openRouteService.getDrivingRoute(
      { lat: yourCurrentLatitude, lon: yourCurrentLongitude },
      { lat: desiredLatitude, lon: desiredLongitude }
    ).subscribe(routeData => {
      console.log('Route Data:', routeData);
    
      if (routeData.features && routeData.features.length > 0) {
        // Extract information about the route
        const routeInfo = routeData.features[0].properties;
    
        console.log('Route Information:', routeInfo);
    
        // Add the GeoJSON layer to the map
        const routeLayer = L.geoJSON(routeData).addTo(this.map!);
    
        // Fit the map to the bounds of the route layer
        this.map?.fitBounds(routeLayer.getBounds());
    
        // You can customize the markers if needed, e.g., set an icon
        const customIcon = L.icon({
          iconUrl: 'assets/marker-icon-2x.png',
          shadowUrl: 'assets/marker-shadow.png',
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [1, -34],
        });
    
        // Add markers for start and end points
        const startPoint = L.marker([yourCurrentLatitude, yourCurrentLongitude], { icon: customIcon }).addTo(this.map!);
        const endPoint = L.marker([desiredLatitude, desiredLongitude], { icon: customIcon }).addTo(this.map!);
    
        // You can also add popups to the markers with additional information
        startPoint.bindPopup('Start Point');
        endPoint.bindPopup('End Point');
      } else {
        console.error('No routes found in the routeData.');
      }
    }, error => {
      console.error('Error fetching route data:', error);
    });
  }    
}

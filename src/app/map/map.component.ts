import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { OpenRouteService } from '../../services/map-service.service';
import { MarkerService } from 'src/services/marker.service';
import { Marker } from 'src/models/Marker';
import { MessageService } from 'primeng/api';

import 'leaflet/dist/leaflet.css';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
  @Input() isDeleteLocation?: boolean;
  @Input() isAddLocation?: boolean;
  @Input() selectedCategoryId: any;

  @Input() selectedMarkerDestination: any;
  @Output() selectedMarkerDestinationChange = new EventEmitter<any>();

  @Output() circuitLocationOnAdd = new EventEmitter<any>();


  map?: L.Map;
  popup: L.Popup | undefined;
  deleteDisplay = false;
  markerToDelete?: any;
  locationToDelete?: Marker;
  routeMessage?: any;
  routingControl?: L.Routing.Control;
  modelMarkers?: any[] = [];
  customIcon: any;
  customIconUser: any;
  addCircuit: Marker[] = [];
  userMarker?: L.Marker;

  markerStart?: Marker;

  constructor(private markerService: MarkerService, private openRouteService: OpenRouteService, private messageService: MessageService) { }

  ngOnInit(): void {

    this.customIcon = L.icon({
      iconUrl: 'assets/marker-icon-2x.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -45],
    });


    this.customIconUser = L.icon({
      iconUrl: 'assets/userlocation.png',
      shadowUrl: 'assets/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -45],
    });


    if (!this.map) {
      this.initializeMap();
    }
    this.openRouteService.mapInitializer.subscribe((initialize) => {
      if (initialize) {
        this.getMarkers(this.selectedCategoryId);
      }

    });

    this.onAddCircuit();
  }
  ngOnChanges(changes: SimpleChanges) {
    // Check if the selectedCategoryId has changed
    if (changes['selectedCategoryId'] && !changes['selectedCategoryId'].firstChange) {
      // Call your method with the new selectedCategoryId
      console.log("selectedCategoryId", this.selectedCategoryId);
      this.getMarkers(this.selectedCategoryId);
    }
    if (changes['selectedMarkerDestination'] && this.selectedMarkerDestination != undefined) {
      this.map!.eachLayer(layer => {
        if (layer instanceof L.Polyline) {
          this.map!.removeLayer(layer);
        }
      })
      this.addCircuit = [];
      this.getCircuit(this.selectedMarkerDestination);
    }
  }

  private initializeMap(): void {
    this.map = L.map('map').setView([36.97245540377546, 9.070844650268556], 60);

    // Add MapTiler tiles as the base layer
    L.tileLayer('https://api.maptiler.com/maps/satellite/{z}/{x}/{y}.jpg?key=s5ynFk7K3vAsdypYZO7i', {
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles courtesy of <a href="https://www.mapbox.com/">Mapbox</a>'
    }).addTo(this.map);


    // Additionally, disable map dragging
    //this.map.dragging.disable();
  }
  /*   convertMarkerToLMarker(marker:Marker):any {
      console.log("merkrr ", marker);
      let markerConverted;
      this.map!.eachLayer(layer=>{
        if(layer instanceof L.Marker && layer.getLatLng().lat === marker.lat && layer.getLatLng().lng === marker.lon ){
          markerConverted = layer;
        }
      })
      return markerConverted;
    } */


  async getRoute(currentLocation: any, desiredLocation: any, isColored: boolean) {
    if (desiredLocation == undefined || currentLocation == undefined) {
      return
    }
    let color = 'red';
    if (isColored) {
      color = 'blue';
    }

    const markers = [
      // { lat: marker.lat, lon: marker.lon },    
      { lat: currentLocation.lat, lon: currentLocation.lon },
      { lat: desiredLocation.lat, lon: desiredLocation.lon }
    ];
    const latlngs = markers.map(marker => [marker.lat, marker.lon]);

    markers.forEach(marker => {
      var markerMap = L.marker([marker.lat, marker.lon]);
      this.map!.addLayer(markerMap);
      markerMap.bindPopup('Marker');
    });

    L.polyline(latlngs, { color: color }).addTo(this.map!);

    this.map!.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        layer.dragging!.disable();

        if (layer.getLatLng() === this.userMarker?.getLatLng())
          layer.setIcon(this.customIconUser)
        else
          layer.setIcon(this.customIcon)
      }
    });
    this.map!.invalidateSize();
  }



  getMarkers(categoryId: Number) {
    console.log("userMarker", this.userMarker);

    if (this.modelMarkers?.length != 0) {
      this.map!.eachLayer(layer => {
        if ((layer instanceof L.Marker && layer.getLatLng().lat !== this.userMarker?.getLatLng().lat && layer.getLatLng().lng !== this.userMarker?.getLatLng().lng) || layer instanceof L.Polyline) {
          this.map!.removeLayer(layer);
        }
      })
    }
    this.markerService.getLocations(categoryId).subscribe((result) => {
      this.modelMarkers = result;
      for (const marker of this.modelMarkers!) {
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="marker-icon">
            <img src="assets/marker-icon-2x.png" alt="Marker Icon" style="width: 25px; height: 41px;" />
            ${marker.name ? `<div class="marker-name" style="font-size: 30px; font-family: Arial;">${marker.name}</div>` : ''}
          </div>
          `,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -45],
        });
        let newMarker = L.marker([marker.lat, marker.lon], { icon: customIcon })
        this.map!.addLayer(newMarker);
        newMarker
          .on('click', async () => {

            this.map!.eachLayer(layer => {
              if (layer instanceof L.Polyline) {
                this.map!.removeLayer(layer);
              }
            })
            this.addCircuit = [];
            this.getCircuit(marker);
            this.selectedMarkerDestinationChange.emit(newMarker);
          })
      }
    });


  }

  onAddCircuit() {
    if (this.isAddLocation) {
      this.map!.eachLayer(layer => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          this.map!.removeLayer(layer);
        }
      });
      this.map?.getContainer().classList.add('map-cursor');
      // Attach event listeners for mouse movement and click
      this.map?.on('mousemove', this.onMouseMove);
      this.map?.on('mouseout', this.onMouseOut);
      this.map?.on('click', this.onClick);
    } else {
      console.log("entereddd hereeee")
      this.map?.getContainer().classList.remove('map-cursor');
      // Remove event listeners if isAddLocation is false
      this.map?.off('mousemove', this.onMouseMove);
      this.map?.off('mouseout', this.onMouseOut);
      this.map?.off('click', this.onClick);
      // Close the popup if it exists
      if (this.popup) {
        this.map?.closePopup(this.popup);
        this.popup = undefined;
      }
    }

  }

  manageOnAddCircuitClick(e: any) {
    if (this.isAddLocation) {
      let marker = new Marker();
      marker.lat = e.lat;
      marker.lon = e.lng;
      this.addCircuit.push(marker);
      this.addCircuit[0].isStartMarker = true;
      if (this.addCircuit.length > 1) {
        for (let i = 1; i < this.addCircuit.length - 1; i++) {
          this.addCircuit[i].isVisible = false;
          this.addCircuit[i - 1].markerSup = this.addCircuit[i];
        }
        this.addCircuit[this.addCircuit.length - 2].markerSup = this.addCircuit[this.addCircuit.length - 1];
        this.getRoute(this.addCircuit[this.addCircuit.length - 2], marker, false);

      }
      this.circuitLocationOnAdd.emit(this.addCircuit);
    }
  }

  makeInvisible(markerCircuit: any[]) {
    for (let marker of markerCircuit) {
      if (!marker.isVisible) {
        this.map!.eachLayer(layer => {
          // Check if the layer is a marker and its coordinates match the given latitude and longitude
          if (layer instanceof L.Marker && layer.getLatLng().lat === marker.lat && layer.getLatLng().lng === marker.lon) {
            // Remove the layer from the map
            this.map!.removeLayer(layer);
          }
        });
      }
    }

  }
  removeMarker(marker: Marker) {
    this.map!.eachLayer(layer => {
      // Check if the layer is a marker and its coordinates match the given latitude and longitude
      if (layer instanceof L.Marker && layer.getLatLng().lat === marker.lat && layer.getLatLng().lng === marker.lon) {
        // Remove the layer from the map
        this.map!.removeLayer(layer);
      }
    });
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
    const newMarker = L.marker(e.latlng, { icon: this.customIcon });
    this.map!.addLayer(newMarker)
    this.manageOnAddCircuitClick(e.latlng);
    this.makeInvisible(this.addCircuit);
  };

  addMarker(marker: Marker) {
    const customIcon = L.divIcon({
      className: 'custom-div-icon',
      html: `<div class="marker-icon">
      <img src="assets/marker-icon-2x.png" alt="Marker Icon" style="width: 25px; height: 41px;" />
      ${marker.name ? `<div class="marker-name" style="font-size: 30px; font-family: Arial;">${marker.name}</div>` : ''}
    </div>
    `,
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [0, -45],
    });
    const newMarker = L.marker([marker.lat!, marker.lon!], { icon: customIcon });
    this.map!.addLayer(newMarker)
  }

  submitDelete() {
    /*  this.markerService.deleteMarker(this.locationToDelete!.id!);
     this.deleteDisplay = false; */
  }
  cancelDelete() {
    /*  this.deleteDisplay = false; */
  }

  removePolyline(latlngs: any) {
    let newPolyline = L.polyline(latlngs).addTo(this.map!);

    this.map!.eachLayer(layer => {
      if (layer instanceof L.Polyline && layer.getBounds().equals(newPolyline.getBounds())) {
        console.log("Removing layer with the same bounds:", layer);
        this.map!.removeLayer(layer);
      }
    });



  }

  /*  calculatePolylineDistance(marker1: Marker, marker2: Marker): number {
     let distance = 0;
     const marker1L = L.marker([marker1.lat!, marker1.lon!])
     const marker2L = L.marker([marker2.lat!, marker2.lon!])
     const latLngs = [marker1L.getLatLng(), marker2L.getLatLng()];
 
     for (let i = 1; i < latLngs.length; i++) {
       const latLng1 = latLngs[i - 1] as L.LatLng;;
       const latLng2 = latLngs[i] as L.LatLng;;
       const d = latLng1.distanceTo(latLng2);
       distance += d;
     }
     console.log("diiss", distance);
     if (distance > 3593380) {
       this.removePolyline(latLngs);
     }
     return distance;
   } */

  async getCircuit(marker: Marker) {
    if (this.userMarker == undefined) {
      await this.watchUserLocation();
    }
    this.map!.eachLayer(layer => {
      if (layer instanceof L.marker || layer instanceof L.Polyline)
        this.map!.removeLayer(layer);
    })
    this.markerService.getCircuit(marker.circuit!.id!).subscribe(markerCircuit => {
      const latlngs: L.LatLngExpression[] = [];
      for (let i = 0; i < markerCircuit.length; i++) {
        const currentMarker = markerCircuit[i];
        if (currentMarker.isStartMarker) {
          this.addMarker(currentMarker);
        }
        if (currentMarker.isStartMarker && this.markerStart != undefined) {

          this.removeMarker(this.markerStart);
        }

        if (currentMarker.isStartMarker) {
          this.markerStart = currentMarker;
        }
        const customIcon = L.divIcon({
          className: 'custom-div-icon',
          html: `<div class="marker-icon">
          <img src="assets/marker-icon-2x.png" alt="Marker Icon" style="width: 25px; height: 41px;" />
          ${marker.name ? `<div class="marker-name" style="font-size: 30px; font-family: Arial;">${marker.name}</div>` : ''}
        </div>
        
        `,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
          popupAnchor: [0, -45],
        });

        latlngs.push([currentMarker.lat!, currentMarker.lon!]);

        if (i > 0) {
          const polyline = L.polyline([latlngs[i - 1], latlngs[i]]);
          this.map!.addLayer(polyline);
        }
      }

      this.makeInvisible(markerCircuit);
    });

  }
  private watchUserLocation(): Promise<Marker> {

    return new Promise<Marker>((resolve, reject) => {
      if (navigator.geolocation) {
        const options: PositionOptions = {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0
        };

        const watchId = navigator.geolocation.watchPosition(
          (position) => {
            const userCoordinates: [number, number] = [
              position.coords.latitude,
              position.coords.longitude
            ];

            // this.map?.setView(userCoordinates, 14);

            if (this.userMarker) {
              // If userMarker already exists, update its position
              this.userMarker.setLatLng(userCoordinates);
            } else {
              // If userMarker doesn't exist, create and add it to the map
              this.userMarker = L.marker(userCoordinates, { icon: this.customIconUser })
                .addTo(this.map!)
                .bindPopup('Your Location')
                .openPopup();
            }
            console.log("userMarker", this.userMarker);

            this.map!.invalidateSize();
            const resultMarker = new Marker();
            resultMarker.lat = userCoordinates[0];
            resultMarker.lon = userCoordinates[1];
            resolve(resultMarker); // Resolve with the resultMarker
          },
          (error) => {
            console.error('Error getting user location:', error.message);
            reject(error); // Reject with an error
          },
          options
        );
      } else {
        console.error('Geolocation is not supported by this browser.');
        reject(new Error('Geolocation not supported')); // Reject with an error
      }
    });
  }

  cancelLocation() {
    console.log("triggeredd")
    this.addCircuit = [];
    this.map!.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        this.map!.removeLayer(layer);
      }
    })
  }
}

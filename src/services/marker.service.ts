import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/env';
import { Marker } from 'src/models/Marker';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private http: HttpClient) { }

  getMarkerById(id: Number){
    let marker: Marker;
    this.http.get(environment.url +"/marker/findById/" + id)
      .pipe(
        map((response:Marker)=>{
          marker = response;
        })
      )
  }

  getAllMarker(id : Number): Observable<Marker[]> {
    return this.http.get<Marker[]>(environment.url + "/marker/findAllByCategory/" +id )
      .pipe(
        map((response: Marker[]) => response),
        catchError((error) => {
          console.error('Error fetching markers:', error);
          return [];
        })
      );
  }

  createMarker(marker: Marker){
    this.http.post(environment.url +"/marker/create",marker);
  }
}

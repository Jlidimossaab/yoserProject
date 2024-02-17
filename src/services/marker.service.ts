import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, map } from 'rxjs';
import { environment } from 'src/env';
import { Marker } from 'src/models/Marker';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {

  constructor(private http: HttpClient,private messageService: MessageService) { }

  getMarkerById(id: Number){
    this.http.get(environment.url +"/marker/findById/" + id);
  }

  getLocationsByCategory(id : Number): Observable<Marker[]> {
    return this.http.get<Marker[]>(environment.url + "/marker/findAllByCategory/" +id );
  }

  createMarker(marker: Marker){
    return this.http.post<Marker>(environment.url +"/marker/create",marker);
  }
  deleteMarker(id : number){
    return this.http.delete(environment.url + "/marker/delete/" + id).subscribe((res)=>{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location successfully deleted' });
    })
  }
}

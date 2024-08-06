import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Observable, catchError, filter, map } from 'rxjs';
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

  getCircuit(circuitId: Number): Observable<Marker[]>{
    return this.http.get<Marker[]>(environment.url +"/marker/findByCircuitId/" + circuitId);
  }

  getLocations(categoryId: Number): Observable<Marker[]> {
    return this.http.get<Marker[]>(environment.url + "/marker/findAllSupMarkers/"+ categoryId);
  }

  createMarkers(markers: Marker[]){
    return this.http.post<Marker>(environment.url +"/marker/createAll",markers);
  }
  deleteMarker(id : number){
    return this.http.delete(environment.url + "/marker/delete/" + id).subscribe((res)=>{
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Location successfully deleted' });
    })
  }

  getMarkerFile(marker: Marker): Observable<string | null > {
    const url = `${environment.url}/marker/findFileByMarker`;
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'arraybuffer' as 'json' // Specify response type as 'arraybuffer'
    };

    return this.http.post<ArrayBuffer>(url, marker, httpOptions).pipe(
      map((response: ArrayBuffer) => {
        const blob = new Blob([response], { type: 'image/png' }); // Assuming image/jpeg format, adjust as needed
        if (blob.size > 0) {
          return URL.createObjectURL(blob); // Return the URL for the created Blob
        } else {
          throw new Error('Marker file is empty'); // Throw an error if the Blob is empty
        }
      }),
      filter((imageUrl: string | null) => imageUrl !== null) // Filter out null values
    );
  }
}

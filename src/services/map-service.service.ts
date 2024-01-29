import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenRouteService {
  private apiKey = '5b3ce3597851110001cf6248b8ad31c14130453a9cbc6415667cc847';
  private apiUrl = 'https://api.openrouteservice.org/v2/directions/driving-car';

  constructor(private http: HttpClient) {}

getDrivingRoute(start: { lat: number, lon: number }, end: { lat: number, lon: number }): Observable<any> {
    const headers = new HttpHeaders({
      'Accept': 'application/json, application/geo+json, application/gpx+xml, img/png; charset=utf-8'
    });

    const params = new HttpParams()
      .set('api_key', this.apiKey)
      .set('start', `${start.lat},${start.lon}`)
      .set('end', `${end.lat},${end.lon}`);

    return this.http.get<any>(this.apiUrl, { headers, params });
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { environment } from 'src/env';
import { Circuit } from 'src/models/Circuit';

@Injectable({
  providedIn: 'root'
})
export class CircuitService {

  constructor(private http: HttpClient,private messageService: MessageService) { }

  createCircuit(circuit: any){
    return this.http.post<Circuit>(environment.url +"/circuit/create",circuit);
  }
}

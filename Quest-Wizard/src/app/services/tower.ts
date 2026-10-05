import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { Tower } from '../models/tower';
import { environment } from '../../environments/environment';

export interface UpdateTowerProfilePayload {
  name?: string;
  rank?: string;
}
 
@Injectable({ providedIn: "root" })
export class TowerService {
  private http = inject(HttpClient);
 
  getAll(): Observable<Tower[]> {
    return this.http.get<Tower[]>(`${environment.apiUrl}/towers`);
  }
 
  getById(id: string): Observable<Tower> {
    return this.http.get<Tower>(`${environment.apiUrl}/towers/${id}`);
  }
 
  updateProfile(id: string, payload: UpdateTowerProfilePayload): Observable<Tower> {
    return this.http.patch<Tower>(`${environment.apiUrl}/towers/${id}`, payload);
  }
}
 
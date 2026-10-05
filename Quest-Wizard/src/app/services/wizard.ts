import { Service } from '@angular/core';

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Wizard } from '../models/wizard';
import { environment } from '../../environments/environment';

 

export interface UpdateWizardProfilePayload {
  name?: string;
  affinity?: string;
  pictureUrl?: string;
  level?: number;
  xp?: number;
}
 
@Injectable({ providedIn: "root" })
export class WizardService {
  private http = inject(HttpClient);
 
  getAll(): Observable<Wizard[]> {
    return this.http.get<Wizard[]>(`${environment.apiUrl}/wizards`);
  }
 
  getById(id: string): Observable<Wizard> {
    return this.http.get<Wizard>(`${environment.apiUrl}/wizards/${id}`);
  }
 
  getWithoutActiveQuest(): Observable<Wizard[]> {
    return this.http.get<Wizard[]>(`${environment.apiUrl}/wizards/without-active-quest`);
  }

  getAvailableForAssignment(): Observable<Wizard[]> {
    return this.http.get<Wizard[]>(`${environment.apiUrl}/wizards/available-for-assignment`);
  }
 

  updateProfile(id: string, payload: UpdateWizardProfilePayload): Observable<Wizard> {
    return this.http.patch<Wizard>(`${environment.apiUrl}/wizards/${id}`, payload);
  }
 
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/wizards/${id}`);
  }
}
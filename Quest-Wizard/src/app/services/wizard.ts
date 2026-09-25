import { Service } from '@angular/core';

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Wizard } from '../models/wizard';
import { environment } from '../../environments/environment';

 
@Injectable({ providedIn: "root" })
export class WizardsService {
  private http = inject(HttpClient);
 
 
  /** Fetch all wizards. Used by WizardsEffects.loadWizards$. */
  getAll(): Observable<Wizard[]> {
    return this.http.get<Wizard[]>(environment.apiUrl+'/wizards');
  }
 
  /** Fetch a single wizard by id. */
  getById(id: string): Observable<Wizard> {
    return this.http.get<Wizard>(`${environment.apiUrl+'/wizards'}/${id}`);
  }
 
  /** Create a new wizard. */
  create(wizard: Omit<Wizard, "id">): Observable<Wizard> {
    return this.http.post<Wizard>(environment.apiUrl+'/wizards', wizard);
  }
 
  /** Update an existing wizard (partial patch). */
  update(id: string, changes: Partial<Wizard>): Observable<Wizard> {
    return this.http.patch<Wizard>(`${environment.apiUrl+'/wizards'}/${id}`, changes);
  }
 
  /** Delete a wizard. */
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl+'/wizards'}/${id}`);
  }
}
import { Service } from '@angular/core';

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { map, Observable } from "rxjs";
import { Wizard } from '../models/wizard';
import { environment } from '../../environments/environment';

 

interface ApiQuestRef {
  id: number;
}
 
/** Raw shape returned by the backend — NOT the normalized store model. */
interface ApiWizard {
  id: string;
  email: string;
  name: string;
  level: number;
  affinity: string;
  xp: number;
  pictureUrl?: string | null;
  activeQuest?: ApiQuestRef | null;
  completedQuests?: ApiQuestRef[];
  isOnActiveQuest: boolean
}
 
/** Converts the backend's nested relation objects into ID references for the store. */
function toWizardModel(api: ApiWizard): Wizard {
  return {
    id: api.id,
    name: api.name,
    level: api.level,
    affinity: api.affinity,
    xp: api.xp,
    pictureUrl: api.pictureUrl ?? "",
    activeQuestId: api.activeQuest?.id ?? null,
    completedQuestIds: (api.completedQuests ?? []).map((q) => q.id),
    isOnActiveQuest: api.isOnActiveQuest
  };
}
 
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
    return this.http
      .get<ApiWizard[]>(`${environment.apiUrl}/wizards`)
      .pipe(map((list) => list.map(toWizardModel)));
  }
 
  getById(id: string): Observable<Wizard> {
    return this.http.get<ApiWizard>(`${environment.apiUrl}/wizards/${id}`).pipe(map(toWizardModel));
  }
 
  /** PATCH /wizards/:id — backend enforces that a wizard may only edit their own profile (or a Tower may edit any). */
  updateProfile(id: string, payload: UpdateWizardProfilePayload): Observable<Wizard> {
    return this.http
      .patch<ApiWizard>(`${environment.apiUrl}/wizards/${id}`, payload)
      .pipe(map(toWizardModel));
  }
 
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/wizards/${id}`);
  }
 
  getWithoutActiveQuest(): Observable<Wizard[]> {
    return this.http
      .get<ApiWizard[]>(`${environment.apiUrl}/wizards/without-active-quest`)
      .pipe(map((list) => list.map(toWizardModel)));
  }
}
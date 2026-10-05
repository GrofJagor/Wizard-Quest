import { HttpClient  } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import {  Observable,  } from 'rxjs';
import { Quest, QuestLevel, QuestStatus } from '../models/quest';

export interface CreateQuestPayload {
  title: string;
  level: QuestLevel;
  patron: string;
  description: string;
  reward: number;
  open?: boolean;
  assignedWizardIds?: string[];
}
 
export type UpdateQuestPayload = Partial<CreateQuestPayload>;
 
@Injectable({ providedIn: "root" })
export class QuestService {
  private http = inject(HttpClient);
 
  getAll(): Observable<Quest[]> {
    return this.http.get<Quest[]>(`${environment.apiUrl}/quests`);
  }
 
  getById(id: number): Observable<Quest> {
    return this.http.get<Quest>(`${environment.apiUrl}/quests/${id}`);
  }
 
  create(payload: CreateQuestPayload): Observable<Quest> {
    return this.http.post<Quest>(`${environment.apiUrl}/quests`, payload);
  }
 
  update(id: number, payload: UpdateQuestPayload): Observable<Quest> {
    return this.http.patch<Quest>(`${environment.apiUrl}/quests/${id}`, payload);
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/quests/${id}`);
  }
 
  getByStatus(status: QuestStatus): Observable<Quest[]> {
    const path =
      status === "OPEN" ? "open" : status === "IN_PROGRESS" ? "in-progress" : "completed";
    return this.http.get<Quest[]>(`${environment.apiUrl}/quests/status/${path}`);
  }
 
  getCompletedForWizard(wizardId: string): Observable<Quest[]> {
    return this.http.get<Quest[]>(`${environment.apiUrl}/quests/wizard/${wizardId}/completed`);
  }
 
  getCreatedByTower(towerId: string): Observable<Quest[]> {
    return this.http.get<Quest[]>(`${environment.apiUrl}/quests/tower/${towerId}/created`);
  }
 

  join(questId: number, wizardId: string): Observable<Quest> {
    return this.http.post<Quest>(`${environment.apiUrl}/quests/${questId}/join`, { wizardId: wizardId });
  }
 

  leave(questId: number): Observable<Quest> {
    return this.http.post<Quest>(`${environment.apiUrl}/quests/${questId}/leave`, {});
  }
 

  start(questId: number): Observable<Quest> {
    return this.http.post<Quest>(`${environment.apiUrl}/quests/${questId}/start`, {});
  }
 

  conclude(questId: number): Observable<Quest> {
    return this.http.post<Quest>(`${environment.apiUrl}/quests/${questId}/conclude`, {});
  }
}
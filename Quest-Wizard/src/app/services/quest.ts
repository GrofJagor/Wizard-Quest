import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import {catchError}from 'rxjs/operators'
import { map, Observable, throwError } from 'rxjs';
import { Quest, QuestLevel, QuestStatus } from '../models/quest';
import { Tower } from '../models/tower';
import { Wizard } from '../models/wizard';


interface ApiQuest {
  id: number;
  title: string;
  level: QuestLevel;
  patron: string;
  description: string;
  reward: number;
  status: QuestStatus;
  open: boolean;
  createdByTower: Tower | null;
  completedByWizards?: Wizard[];
  activeWizards?: Wizard[];
}
 
/** Defensive defaults only — the backend always sends these arrays, but
 * don't let a missing key crash a .map()/.filter() downstream. */
function toQuestModel(api: ApiQuest): Quest {
  return {
    id: api.id,
    title: api.title,
    level: api.level,
    patron: api.patron,
    description: api.description,
    reward: api.reward,
    status: api.status,
    open: api.open,
    createdByTower: api.createdByTower ?? null,
    completedByWizards: api.completedByWizards ?? [],
    activeWizards: api.activeWizards ?? [],
  };
}
 
export interface CreateQuestPayload {
  title: string;
  level: QuestLevel;
  patron: string;
  description: string;
  reward: number;
  open?: boolean;
  createdByTowerId?: string;
}
 
export type UpdateQuestPayload = Partial<CreateQuestPayload> & { status?: QuestStatus };
 
@Injectable({ providedIn: "root" })
export class QuestsService {
  private http = inject(HttpClient);
 
  getAll(): Observable<Quest[]> {
    return this.http
      .get<ApiQuest[]>(`${environment.apiUrl}/quests`)
      .pipe(map((list) => list.map(toQuestModel)));
  }
 
  getById(id: number): Observable<Quest> {
    return this.http.get<ApiQuest>(`${environment.apiUrl}/quests/${id}`).pipe(map(toQuestModel));
  }
 
  create(payload: CreateQuestPayload): Observable<Quest> {
    return this.http.post<ApiQuest>(`${environment.apiUrl}/quests`, payload).pipe(map(toQuestModel));
  }
 
  update(id: number, payload: UpdateQuestPayload): Observable<Quest> {
    return this.http
      .patch<ApiQuest>(`${environment.apiUrl}/quests/${id}`, payload)
      .pipe(map(toQuestModel));
  }
 
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/quests/${id}`);
  }
 
  /** status: "OPEN" | "IN_PROGRESS" | "COMPLETED" — maps to the backend's kebab-case routes. */
  getByStatus(status: QuestStatus): Observable<Quest[]> {
    const path =
      status === "OPEN" ? "open" : status === "IN_PROGRESS" ? "in-progress" : "completed";
    return this.http
      .get<ApiQuest[]>(`${environment.apiUrl}/quests/status/${path}`)
      .pipe(map((list) => list.map(toQuestModel)));
  }
 
  getCompletedForWizard(wizardId: string): Observable<Quest[]> {
    return this.http
      .get<ApiQuest[]>(`${environment.apiUrl}/quests/wizard/${wizardId}/completed`)
      .pipe(map((list) => list.map(toQuestModel)));
  }
 
  getCreatedByTower(towerId: string): Observable<Quest[]> {
    return this.http
      .get<ApiQuest[]>(`${environment.apiUrl}/quests/tower/${towerId}/created`)
      .pipe(map((list) => list.map(toQuestModel)));
  }

  join(questId: number, wizardId: string): Observable<Quest> {
    return this.http
      .post<ApiQuest>(`${environment.apiUrl}/quests/${questId}/join`, { wizardId })
      .pipe(map(toQuestModel));
  }
}
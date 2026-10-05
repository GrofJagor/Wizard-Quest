import { HttpClient } from '@angular/common/http';
import { inject, Injectable, Service } from '@angular/core';
import { Observable } from 'rxjs';
import { UserProfileView } from '../models/user.profile';
import { environment } from '../../environments/environment';


 
@Injectable({ providedIn: "root" })
export class UserService {
  private http = inject(HttpClient);
 
  getById(id: string): Observable<UserProfileView> {
    return this.http.get<UserProfileView>(`${environment.apiUrl}/users/${id}`);
  }
}
 

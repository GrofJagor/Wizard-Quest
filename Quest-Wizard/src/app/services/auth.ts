import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { BehaviorSubject, Observable, catchError, of, switchMap, tap } from "rxjs";
import { Router } from "@angular/router";
import {
  AuthResponse,
  CurrentUserProfile,
  LoginPayload,
  RegisterPayload,
} from "../models/auth";
import { environment } from "../../environments/environment";

export const AUTH_TOKEN_KEY = "wizard_tower_token";



@Injectable({ providedIn: "root" })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);

  private currentUserSubject = new BehaviorSubject<CurrentUserProfile | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {

    this.restoreSession();
  }

  get token(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  }

  login(payload: LoginPayload): Observable<CurrentUserProfile | null> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/login`, payload).pipe(
      tap((res) => localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken)),
      switchMap(() => this.fetchProfile())
    );
  }

  register(payload: RegisterPayload): Observable<CurrentUserProfile | null> {
    return this.http.post<AuthResponse>(`${environment.apiUrl}/auth/register`, payload).pipe(
      tap((res) => localStorage.setItem(AUTH_TOKEN_KEY, res.accessToken)),
      switchMap(() => this.fetchProfile())
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(["/login"]);
  }

  private restoreSession(): void {
    if (!this.token) return;
    this.fetchProfile().subscribe();
  }

  private fetchProfile(): Observable<CurrentUserProfile | null> {
    return this.http.get<CurrentUserProfile>(`${environment.apiUrl}/users/me`).pipe(
      tap((profile) => this.currentUserSubject.next(profile)),
      catchError(() => {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        this.currentUserSubject.next(null);
        return of(null);
      })
    );
  }
}
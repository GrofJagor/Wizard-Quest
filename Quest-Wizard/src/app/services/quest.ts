import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, Service } from '@angular/core';
import { environment } from '../../environments/environment';
import {catchError}from 'rxjs/operators'
import { Observable, throwError } from 'rxjs';
import { Quest } from '../models/quest';


@Injectable({
    providedIn: "root"
})

//@Service()
export class QuestsService {
    constructor(private httpClient:HttpClient){}


     getAll() :Observable<Quest[]>
    {
        // console.log(this.httpClient.get<Quest[]>(environment.apiUrl+'/quest').pipe(
        // catchError(ErrorHandler)))
       return this.httpClient.get<Quest[]>(environment.apiUrl+'/quest').pipe(
        catchError(ErrorHandler)
    
       )
    }
}

const ErrorHandler=(error:HttpErrorResponse)=>
{
    const errorMessage=(error.status===0)?
    `Cant connect to API ${error.error}`:
    `Backend return code ${error.status}`;
    return throwError(errorMessage)
}


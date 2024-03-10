import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    constructor(private http: HttpClient) {}

    async register(payLoad: any) {
        console.warn('register credentials', payLoad);

        // return  this.http.post(
        //     'http://45.85.250.231:8000/api/auth/register',
        //     payLoad
        // );
    }
}

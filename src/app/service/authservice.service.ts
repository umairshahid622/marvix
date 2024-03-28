import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthserviceService {

  constructor(private router: Router) { }

  setToken(token: string): void {
    localStorage.setItem('access_token', token);
  }
  getToken(): string {
    let token: string = localStorage.getItem('access_token')
    return token.toString();
  }

  isLoggedIn(): boolean {
    console.log("Token",this.getToken());
    return this.getToken() !== null;
  }

  logout(): void {
    localStorage.removeItem('access_token');

    document.cookie.split(";").forEach((c) => {
      document.cookie = c
        .replace(/^ +/, "")
        .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
    });

    this.router.navigate(['/pages/login'])
  }
}

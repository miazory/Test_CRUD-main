import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly storageKey = 'auth_user';
  private readonly loggedInSignal = signal<boolean>(this.hasStoredSession());

  private hasStoredSession(): boolean {
    try {
      return !!localStorage.getItem(this.storageKey);
    } catch {
      return false;
    }
  }

  isAuthenticated(): boolean {
    return this.loggedInSignal();
  }

  login(username: string, password: string): boolean {
    const isValid = username === 'admin' && password === 'admin123';
    if (isValid) {
      localStorage.setItem(this.storageKey, username);
      this.loggedInSignal.set(true);
    } else {
      this.loggedInSignal.set(false);
    }
    return isValid;
  }

  logout(): void {
    localStorage.removeItem(this.storageKey);
    this.loggedInSignal.set(false);
  }
}

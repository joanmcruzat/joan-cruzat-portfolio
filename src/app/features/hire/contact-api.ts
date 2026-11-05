import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export const CONTACT_URL = '/api/contact';

export interface HireInquiry {
  readonly name: string;
  readonly company: string;
  readonly email: string;
  readonly role: string;
  readonly message: string;
  readonly budget: string;
  readonly website: string;
  readonly companyFax: string; // honeypot, must stay empty
}

@Injectable({ providedIn: 'root' })
export class ContactApi {
  private readonly http = inject(HttpClient);

  send(inquiry: HireInquiry): Observable<{ ok: true }> {
    return this.http.post<{ ok: true }>(CONTACT_URL, inquiry);
  }
}

import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export const CHAT_URL = '/api/chat';

export interface ChatMessage {
  readonly role: 'user' | 'assistant';
  readonly content: string;
}

@Injectable({ providedIn: 'root' })
export class ChatApi {
  private readonly http = inject(HttpClient);

  // The conversation must start with the visitor; the greeting is UI-only.
  send(messages: readonly ChatMessage[]): Observable<{ reply: string }> {
    return this.http.post<{ reply: string }>(CHAT_URL, { messages });
  }
}

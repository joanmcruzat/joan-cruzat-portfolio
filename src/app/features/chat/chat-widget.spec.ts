import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CHAT_URL } from './chat-api';
import { ChatWidget } from './chat-widget';

describe('ChatWidget', () => {
  let fixture: ComponentFixture<ChatWidget>;
  let http: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(ChatWidget);
    fixture.componentRef.setInput('fullName', 'Ada Lovelace');
    fixture.componentRef.setInput('linkedinUrl', 'https://www.linkedin.com/in/ada');
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  async function open(): Promise<void> {
    fixture.nativeElement.querySelector('.chat-launcher').click();
    await fixture.whenStable();
  }

  async function ask(text: string): Promise<void> {
    const input: HTMLInputElement = fixture.nativeElement.querySelector('.chat-form input');
    input.value = text;
    input.dispatchEvent(new Event('input'));
    await fixture.whenStable();
    fixture.nativeElement.querySelector('.chat-form button').click();
    await fixture.whenStable();
  }

  function messages(): string[] {
    return [...fixture.nativeElement.querySelectorAll('.chat-msg')].map((m: Element) => m.textContent?.trim() ?? '');
  }

  it('greets the visitor with the owner name and LinkedIn link', async () => {
    await open();

    expect(messages()[0]).toContain("Hi! I'm Ada's AI assistant.");
    expect(fixture.nativeElement.querySelector('.chat-msg a').getAttribute('href')).toBe('https://www.linkedin.com/in/ada');
  });

  it('sends only the visitor conversation and shows the reply', async () => {
    await open();

    await ask('What does Ada build?');
    const request = http.expectOne(CHAT_URL);
    expect(request.request.body).toEqual({ messages: [{ role: 'user', content: 'What does Ada build?' }] });
    request.flush({ reply: 'Ada builds APIs.' });
    await fixture.whenStable();

    expect(messages().slice(1)).toEqual(['What does Ada build?', 'Ada builds APIs.']);
  });

  it('shows the server problem detail when the assistant fails', async () => {
    await open();

    await ask('Hello?');
    http.expectOne(CHAT_URL).flush(
      { type: 'about:blank', title: 'Too Many Requests', status: 429, detail: "You're sending messages too quickly." },
      { status: 429, statusText: 'Too Many Requests' }
    );
    await fixture.whenStable();

    expect(messages().at(-1)).toBe("You're sending messages too quickly.");
  });

  it('does not send blank messages', async () => {
    await open();

    await ask('   ');

    http.expectNone(CHAT_URL);
  });
});

import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideZonelessChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CONTACT_URL } from './contact-api';
import { HireModal } from './hire-modal';

describe('HireModal', () => {
  let fixture: ComponentFixture<HireModal>;
  let http: HttpTestingController;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      providers: [provideZonelessChangeDetection(), provideHttpClient(), provideHttpClientTesting()]
    });
    http = TestBed.inject(HttpTestingController);
    fixture = TestBed.createComponent(HireModal);
    fixture.componentRef.setInput('email', 'ada@example.com');
    await fixture.whenStable();
  });

  afterEach(() => http.verify());

  function fill(name: string, value: string): void {
    const field: HTMLInputElement | HTMLTextAreaElement = fixture.nativeElement.querySelector(`[formcontrolname="${name}"]`);
    field.value = value;
    field.dispatchEvent(new Event('input'));
  }

  function fillRequiredFields(email = 'grace@example.com'): void {
    fill('name', 'Grace Hopper');
    fill('company', 'Navy');
    fill('email', email);
    fill('role', 'Staff Engineer');
    fill('message', 'We would like to talk.');
  }

  async function submit(): Promise<void> {
    fixture.nativeElement.querySelector('button[type="submit"]').click();
    await fixture.whenStable();
  }

  it('shows a validation error and sends nothing when required fields are empty', async () => {
    await submit();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('Please complete all required fields.');
    http.expectNone(CONTACT_URL);
  });

  it('rejects an invalid email address', async () => {
    fillRequiredFields('not-an-email');

    await submit();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('Please provide a valid email address.');
    http.expectNone(CONTACT_URL);
  });

  it('sends the inquiry and shows a confirmation', async () => {
    fillRequiredFields();

    await submit();
    const request = http.expectOne(CONTACT_URL);
    expect(request.request.body).toMatchObject({ name: 'Grace Hopper', email: 'grace@example.com', companyFax: '' });
    request.flush({ ok: true });
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.success')).not.toBeNull();
  });

  it('shows the server problem detail when sending fails', async () => {
    fillRequiredFields();

    await submit();
    http.expectOne(CONTACT_URL).flush(
      { type: 'about:blank', title: 'Bad Gateway', status: 502, detail: 'The email service could not send the inquiry.' },
      { status: 502, statusText: 'Bad Gateway' }
    );
    await fixture.whenStable();

    expect(fixture.nativeElement.querySelector('.error').textContent).toContain('The email service could not send the inquiry.');
  });

  it('pretends to succeed without sending when the honeypot is filled', async () => {
    fill('companyFax', 'bot');

    await submit();

    expect(fixture.nativeElement.querySelector('.success')).not.toBeNull();
    http.expectNone(CONTACT_URL);
  });
});

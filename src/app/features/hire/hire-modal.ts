import { ChangeDetectionStrategy, Component, DestroyRef, inject, input, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { problemDetail } from '../../core/http/problem-details';
import { ContactApi } from './contact-api';

const SEND_FAILED = 'Unable to send right now. Please use the email or LinkedIn option below.';

@Component({
  selector: 'app-hire-modal',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './hire-modal.html'
})
export class HireModal {
  readonly email = input.required<string>();
  readonly closed = output();

  private readonly contactApi = inject(ContactApi);
  private readonly destroyRef = inject(DestroyRef);

  protected readonly form = inject(NonNullableFormBuilder).group({
    name: ['', Validators.required],
    company: ['', Validators.required],
    email: ['', [Validators.required, Validators.email]],
    role: ['', Validators.required],
    message: ['', Validators.required],
    budget: [''],
    website: [''],
    companyFax: ['']
  });

  protected readonly sending = signal(false);
  protected readonly sent = signal(false);
  protected readonly error = signal('');

  close(): void {
    if (!this.sending()) this.closed.emit();
  }

  protected submit(): void {
    if (this.sending()) return;
    const inquiry = this.form.getRawValue();

    // Bots fill the hidden honeypot field; pretend success without sending.
    if (inquiry.companyFax) {
      this.sent.set(true);
      return;
    }
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error.set(this.form.controls.email.hasError('email')
        ? 'Please provide a valid email address.'
        : 'Please complete all required fields.');
      return;
    }

    this.sending.set(true);
    this.error.set('');
    this.contactApi.send(inquiry).pipe(
      finalize(() => this.sending.set(false)),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: () => {
        this.sent.set(true);
        this.form.reset();
      },
      error: (error: unknown) => this.error.set(problemDetail(error, SEND_FAILED))
    });
  }
}

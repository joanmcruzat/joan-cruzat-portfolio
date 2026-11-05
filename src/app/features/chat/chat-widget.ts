import {
  ChangeDetectionStrategy, Component, DestroyRef, ElementRef, Injector, afterNextRender, computed, inject, input, signal, viewChild
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, finalize, map, of } from 'rxjs';
import { problemDetail } from '../../core/http/problem-details';
import { ChatApi, ChatMessage } from './chat-api';

const MAX_MESSAGE_CHARS = 1500;
const REPLY_FAILED = 'Sorry, I can\'t respond right now. Please use the Hire Me form or email instead.';

@Component({
  selector: 'app-chat-widget',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-widget.html'
})
export class ChatWidget {
  readonly fullName = input.required<string>();
  readonly linkedinUrl = input.required<string>();

  private readonly chatApi = inject(ChatApi);
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly chatLog = viewChild<ElementRef<HTMLElement>>('chatLog');

  protected readonly maxMessageChars = MAX_MESSAGE_CHARS;
  protected readonly isOpen = signal(false);
  protected readonly sending = signal(false);
  protected readonly draft = signal('');
  protected readonly messages = signal<readonly ChatMessage[]>([]);
  protected readonly canSend = computed(() => !this.sending() && this.draft().trim().length > 0);
  protected readonly initials = computed(() =>
    this.fullName().split(' ').map((part) => part[0] ?? '').join('').slice(0, 2).toUpperCase()
  );
  protected readonly firstName = computed(() => this.fullName().split(' ')[0]);
  protected readonly greeting = computed(() =>
    `Hi! I'm ${this.firstName()}'s AI assistant. Ask me about their experience, skills or projects.\n\n` +
    `You can also connect with ${this.firstName()} on LinkedIn:`
  );
  protected readonly linkedinLabel = computed(() => this.linkedinUrl().replace(/^https?:\/\/(www\.)?/, ''));

  toggle(): void {
    this.isOpen.update((isOpen) => !isOpen);
    if (this.isOpen()) this.scrollToEnd();
  }

  close(): void {
    this.isOpen.set(false);
  }

  protected updateDraft(event: Event): void {
    this.draft.set((event.target as HTMLInputElement).value);
  }

  protected send(event: Event): void {
    event.preventDefault();
    const text = this.draft().trim();
    if (!text || this.sending()) return;

    this.messages.update((messages) => [...messages, { role: 'user', content: text }]);
    this.draft.set('');
    this.sending.set(true);
    this.scrollToEnd();

    this.chatApi.send(this.messages()).pipe(
      map((response) => response.reply),
      catchError((error: unknown) => of(problemDetail(error, REPLY_FAILED))),
      finalize(() => {
        this.sending.set(false);
        this.scrollToEnd();
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe((reply) => {
      this.messages.update((messages) => [...messages, { role: 'assistant', content: reply }]);
    });
  }

  private scrollToEnd(): void {
    afterNextRender(() => {
      const log = this.chatLog()?.nativeElement;
      if (log) log.scrollTop = log.scrollHeight;
    }, { injector: this.injector });
  }
}

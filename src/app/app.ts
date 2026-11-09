import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { PortfolioContentStore } from './content/portfolio-content.store';
import { ChatWidget } from './features/chat/chat-widget';
import { HireModal } from './features/hire/hire-modal';
import { Footer } from './layout/footer';
import { Nav } from './layout/nav';
import { Approach } from './sections/approach';
import { Contact } from './sections/contact';
import { Experience } from './sections/experience';
import { Hero } from './sections/hero';
import { Marquee } from './sections/marquee';
import { Work } from './sections/work';
import { ContentStatus } from './ui/content-status';
import { Cursor } from './ui/cursor';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    Nav, Hero, Marquee, Work, Approach, Experience, Contact, Footer,
    HireModal, ChatWidget, ContentStatus, Cursor
  ],
  templateUrl: './app.html'
})
export class App {
  private readonly store = inject(PortfolioContentStore);

  protected readonly content = this.store.content;
  protected readonly profile = this.store.profile;
  protected readonly hasError = this.store.hasError;
  protected readonly hireOpen = signal(false);

  protected reload(): void {
    this.store.reload();
  }
}

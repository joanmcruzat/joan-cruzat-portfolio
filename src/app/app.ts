import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { SITE } from './content/site';
import { Cursor } from './ui/cursor';
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

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Nav, Hero, Marquee, Work, Approach, Experience, Contact, Footer, HireModal, ChatWidget, Cursor],
  templateUrl: './app.html'
})
export class App {
  protected readonly site = SITE;
  protected readonly hireOpen = signal(false);
}

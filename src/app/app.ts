import { ChangeDetectionStrategy, Component, effect, inject, signal, viewChild } from '@angular/core';
import { PageMetaService } from './core/content/page-meta.service';
import { PortfolioContentStore } from './core/content/portfolio-content.store';
import { SiteFooter } from './core/layout/site-footer';
import { SiteNav } from './core/layout/site-nav';
import { ThemeService } from './core/theme/theme.service';
import { ChatWidget } from './features/chat/chat-widget';
import { HireModal } from './features/hire/hire-modal';
import { AboutSection } from './features/portfolio/about-section';
import { ArchitectureSection } from './features/portfolio/architecture-section';
import { ContactSection } from './features/portfolio/contact-section';
import { EngineeringSection } from './features/portfolio/engineering-section';
import { ExperienceSection } from './features/portfolio/experience-section';
import { HeroSection } from './features/portfolio/hero-section';
import { ProjectsSection } from './features/portfolio/projects-section';
import { TickerStrip } from './features/portfolio/ticker-strip';
import { ToolboxSection } from './features/portfolio/toolbox-section';

@Component({
  selector: 'app-root',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    SiteNav, SiteFooter, HeroSection, TickerStrip, AboutSection, ExperienceSection, ProjectsSection,
    EngineeringSection, ArchitectureSection, ToolboxSection, ContactSection, HireModal, ChatWidget
  ],
  templateUrl: './app.html',
  host: { '(document:keydown.escape)': 'onEscape()' }
})
export class App {
  protected readonly store = inject(PortfolioContentStore);
  protected readonly hireOpen = signal(false);
  private readonly hireModal = viewChild(HireModal);
  private readonly chatWidget = viewChild(ChatWidget);

  constructor() {
    inject(ThemeService); // applies the saved theme before first paint
    const pageMeta = inject(PageMetaService);
    effect(() => {
      const profile = this.store.profile();
      if (profile) pageMeta.apply(profile);
    });
  }

  protected onEscape(): void {
    const hireModal = this.hireModal();
    if (hireModal) hireModal.close();
    else this.chatWidget()?.close();
  }
}

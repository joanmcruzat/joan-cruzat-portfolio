import { ChangeDetectionStrategy, Component, computed, inject, input, output, signal } from '@angular/core';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { ThemeService } from '../theme/theme.service';

const SECTIONS = [
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Experience' },
  { id: 'projects', label: 'Projects' },
  { id: 'toolbox', label: 'Skills' },
  { id: 'engineering', label: 'Engineering' },
  { id: 'contact', label: 'Contact' }
] as const;

@Component({
  selector: 'app-site-nav',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <header class="nav" appReveal="enter" [revealY]="-10" [revealDuration]="0.55">
      <a class="brand" href="#home" (click)="menuOpen.set(false)">{{ firstName() }} <span>{{ lastName() }}</span></a>
      <nav [class.open]="menuOpen()">
        @for (section of sections; track section.id) {
          <a [href]="'#' + section.id" (click)="menuOpen.set(false)">{{ section.label }}</a>
        }
      </nav>
      <div class="nav-actions">
        <button class="icon-btn" (click)="theme.toggle()" [attr.aria-label]="theme.isDark() ? 'Use light mode' : 'Use dark mode'">
          {{ theme.isDark() ? '☼' : '☾' }}
        </button>
        <button class="hire-btn" (click)="hire.emit()">Hire Me <span>→</span></button>
        <button class="menu-btn" (click)="menuOpen.set(!menuOpen())" [attr.aria-expanded]="menuOpen()" aria-label="Open menu">☰</button>
      </div>
    </header>
  `
})
export class SiteNav {
  readonly fullName = input.required<string>();
  readonly hire = output();

  protected readonly theme = inject(ThemeService);
  protected readonly sections = SECTIONS;
  protected readonly menuOpen = signal(false);
  protected readonly firstName = computed(() => this.fullName().split(' ')[0]);
  protected readonly lastName = computed(() => this.fullName().split(' ').slice(1).join(' '));
}

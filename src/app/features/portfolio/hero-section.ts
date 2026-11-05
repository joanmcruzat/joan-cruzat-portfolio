import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Profile } from '../../core/content/portfolio-content.model';
import { RevealDirective } from '../../shared/motion/reveal.directive';
import { engineerSnippet } from './engineer-snippet';

@Component({
  selector: 'app-hero-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    @let p = profile();
    <section class="hero section">
      <div class="hero-copy" appReveal="enter" [revealY]="24" [revealDuration]="0.85">
        <div class="eyebrow"><span class="pulse"></span> {{ p.availability }}</div>
        <h1>{{ p.heroTitle }} <em>{{ p.heroHighlight }}</em></h1>
        <p class="lead">{{ p.summary }}</p>
        <div class="hero-actions">
          <button class="primary" (click)="hire.emit()">Hire Me <span>→</span></button>
          <a class="secondary" href="#projects">View My Work</a>
          <a class="secondary" [href]="p.resumeUrl" download>Download Resume</a>
        </div>
        <div class="socials">
          <a [href]="p.githubUrl" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
          <a [href]="p.linkedinUrl" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        </div>
      </div>
      <div class="hero-visual" appReveal="enter" [revealY]="18" [revealDuration]="0.9" [revealDelay]="0.12">
        <div class="terminal" appReveal="enter" [revealY]="0" [revealScale]="0.985" [revealDuration]="1" [revealDelay]="0.18">
          <div class="terminal-bar"><span></span><span></span><span></span><small>{{ fileName() }}</small></div>
<pre><code>@for (line of codeLines(); track $index) {@for (token of line; track $index) {<span [class]="token.kind">{{ token.text }}</span>}{{ newline }}}</code></pre>
        </div>
        <div class="experience-badge" appReveal="enter" [revealY]="8" [revealScale]="0.97" [revealDuration]="0.9" [revealDelay]="0.35">
          <strong>{{ p.yearsExperience }}</strong><span>YEARS<br />EXPERIENCE</span>
        </div>
      </div>
    </section>
  `
})
export class HeroSection {
  readonly profile = input.required<Profile>();
  readonly hire = output();

  protected readonly newline = '\n';

  protected readonly codeLines = computed(() => engineerSnippet(this.profile()));
  protected readonly fileName = computed(
    () => `${this.profile().fullName.toLowerCase().replaceAll(' ', '-')}-engineer.ts`
  );
}

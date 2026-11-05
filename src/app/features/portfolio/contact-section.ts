import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { Profile } from '../../core/content/portfolio-content.model';
import { RevealDirective } from '../../shared/motion/reveal.directive';

@Component({
  selector: 'app-contact-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    @let p = profile();
    <section id="contact" class="section contact">
      <div class="contact-box" appReveal [revealY]="30" [revealDuration]="0.75">
        <div>
          <div class="section-label">07 / CONTACT</div>
          <h2>{{ p.contactHeading }}</h2>
          <p>{{ p.contactText }}</p>
        </div>
        <button class="primary large" (click)="hire.emit()">Hire Me <span>→</span></button>
      </div>
      <div class="contact-links">
        <a [href]="'mailto:' + p.email">Email Me ↗</a>
        <a [href]="p.linkedinUrl" target="_blank" rel="noopener noreferrer">LinkedIn ↗</a>
        <a [href]="p.githubUrl" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
        <a [href]="p.resumeUrl" download>Download Resume ↗</a>
      </div>
    </section>
  `
})
export class ContactSection {
  readonly profile = input.required<Profile>();
  readonly hire = output();
}

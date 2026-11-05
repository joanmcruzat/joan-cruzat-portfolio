import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Profile } from '../../core/content/portfolio-content.model';
import { RevealDirective } from '../../shared/motion/reveal.directive';

@Component({
  selector: 'app-about-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="about" class="section split reveal" appReveal [revealY]="34" [revealDuration]="0.8">
      <div>
        <div class="section-label">01 / ABOUT</div>
        <h2>{{ profile().aboutHeading }}</h2>
      </div>
      <div class="prose">
        @for (paragraph of profile().aboutParagraphs; track paragraph) {
          <p>{{ paragraph }}</p>
        }
        <div class="quote">“{{ profile().aboutQuote }}”</div>
      </div>
    </section>
  `
})
export class AboutSection {
  readonly profile = input.required<Profile>();
}

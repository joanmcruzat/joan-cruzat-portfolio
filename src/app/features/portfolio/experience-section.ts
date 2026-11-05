import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Experience } from '../../core/content/portfolio-content.model';
import { RevealDirective, staggerDelay } from '../../shared/motion/reveal.directive';

@Component({
  selector: 'app-experience-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="experience" class="section">
      <div class="section-label">02 / EXPERIENCE</div>
      <h2>Production experience.</h2>
      <div class="timeline">
        @for (item of experience(); track item.period + item.role; let i = $index) {
          <article appReveal [revealY]="30" [revealDelay]="stagger(i)">
            <div class="time">{{ item.period }}</div>
            <div>
              <h3>{{ item.role }}</h3>
              @if (item.company) {
                <p class="company">{{ item.company }}</p>
              }
              <p>{{ item.description }}</p>
              <div class="chips">
                @for (tech of item.tech; track tech) {
                  <span>{{ tech }}</span>
                }
              </div>
            </div>
          </article>
        }
      </div>
    </section>
  `
})
export class ExperienceSection {
  readonly experience = input.required<readonly Experience[]>();
  protected readonly stagger = staggerDelay;
}

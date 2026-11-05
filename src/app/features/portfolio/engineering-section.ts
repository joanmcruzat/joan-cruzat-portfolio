import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Principle } from '../../core/content/portfolio-content.model';
import { RevealDirective, staggerDelay } from '../../shared/motion/reveal.directive';

@Component({
  selector: 'app-engineering-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RevealDirective],
  template: `
    <section id="engineering" class="section engineering">
      <div class="section-label">04 / ENGINEERING</div>
      <h2>How I think as an engineer.</h2>
      <div class="principles">
        @for (principle of principles(); track principle.title; let i = $index) {
          <article appReveal [revealY]="24" [revealDuration]="0.6" [revealDelay]="stagger(i)">
            <b>{{ i + 1 | number: '2.0-0' }}</b>
            <h3>{{ principle.title }}</h3>
            <p>{{ principle.description }}</p>
          </article>
        }
      </div>
    </section>
  `
})
export class EngineeringSection {
  readonly principles = input.required<readonly Principle[]>();
  protected readonly stagger = staggerDelay;
}

import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { QualityArea, Tool } from '../../core/content/portfolio-content.model';
import { RevealDirective, staggerDelay } from '../../shared/motion/reveal.directive';

@Component({
  selector: 'app-toolbox-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RevealDirective],
  template: `
    <section class="section toolbox" id="toolbox">
      <div class="section-label">06 / TOOLBOX</div>
      <h2>Technologies I work with.</h2>
      <div class="tech-grid">
        @for (tool of tools(); track tool.name) {
          <div class="tech-card">
            <div class="tech-logo"><img [src]="tool.iconUrl" [alt]="tool.iconAlt" loading="lazy" /></div>
            <strong>{{ tool.name }}</strong>
            <span>{{ tool.description }}</span>
          </div>
        }
      </div>
      <div class="quality-grid">
        @for (area of qualityAreas(); track area.title; let i = $index) {
          <article class="quality-card" appReveal [revealY]="24" [revealDuration]="0.65" [revealDelay]="stagger(i)">
            <span class="quality-number">{{ i + 1 | number: '2.0-0' }}</span>
            <h3>{{ area.title }}</h3>
            <p>{{ area.description }}</p>
          </article>
        }
      </div>
    </section>
  `
})
export class ToolboxSection {
  readonly tools = input.required<readonly Tool[]>();
  readonly qualityAreas = input.required<readonly QualityArea[]>();
  protected readonly stagger = staggerDelay;
}

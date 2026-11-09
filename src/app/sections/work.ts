import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project, SectionCopy } from '../content/portfolio-content.model';
import { RevealDirective } from '../directives/reveal.directive';
import { ProjectRow } from '../ui/project-row';

@Component({
  selector: 'app-work',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ProjectRow, RevealDirective],
  template: `
    <section id="work" class="section" aria-labelledby="work-title">
      <div class="wrap">
        <div appReveal>
          <p class="eyebrow">{{ copy().eyebrow }}</p>
          <h2 id="work-title" class="h2 pre-line">{{ copy().before }}<span class="serif">{{ copy().accent }}</span>{{ copy().after }}</h2>
        </div>
        <div class="rows">
          @for (project of projects(); track project.id; let i = $index) {
            <app-project-row appReveal [revealIndex]="i" [project]="project" [index]="i" />
          }
        </div>
      </div>
    </section>
  `,
  styles: `
    .eyebrow { margin: 0; }
    .rows { margin-top: 72px; }
  `
})
export class Work {
  readonly copy = input.required<SectionCopy>();
  readonly projects = input.required<readonly Project[]>();
}

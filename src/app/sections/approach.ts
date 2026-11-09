import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Principle, SectionCopy } from '../content/portfolio-content.model';
import { RevealDirective } from '../directives/reveal.directive';
import { ArchDiagram } from '../ui/arch-diagram';
import { PrincipleCard } from '../ui/principle-card';

@Component({
  selector: 'app-approach',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ArchDiagram, PrincipleCard, RevealDirective],
  template: `
    <section id="approach" class="section" aria-labelledby="approach-title">
      <div class="wrap">
        <div appReveal>
          <p class="eyebrow">{{ copy().eyebrow }}</p>
          <h2 id="approach-title" class="h2 pre-line">{{ copy().before }}<span class="serif">{{ copy().accent }}</span>{{ copy().after }}</h2>
        </div>
        <div class="grid">
          <div class="principles">
            @for (principle of principles(); track principle.id; let i = $index) {
              <app-principle-card appReveal [revealIndex]="i" [principle]="principle" [index]="i" />
            }
          </div>
          <app-arch-diagram class="diagram" appReveal />
        </div>
      </div>
    </section>
  `,
  styles: `
    .section { padding-top: 40px; }
    .eyebrow { margin: 0; }
    .grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 72px;
      align-items: start;
      margin-top: 64px;
    }
    .principles {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1px;
      overflow: hidden;
      border: 1px solid var(--line);
      border-radius: var(--radius-card);
      background: var(--line);
    }
    .diagram { position: sticky; top: 110px; }
    @media (max-width: 960px) {
      .grid { grid-template-columns: minmax(0, 1fr); gap: 48px; }
      .diagram { position: relative; top: 0; }
    }
    @media (max-width: 560px) {
      .principles { grid-template-columns: minmax(0, 1fr); }
    }
  `
})
export class Approach {
  readonly copy = input.required<SectionCopy>();
  readonly principles = input.required<readonly Principle[]>();
}

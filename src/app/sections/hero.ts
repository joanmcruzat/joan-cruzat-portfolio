import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { SITE } from '../content/site';
import { PortraitStage } from '../ui/portrait-stage';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PortraitStage],
  template: `
    <section class="wrap" aria-labelledby="hero-title">
      <div class="hero-grid">
        <div>
          <p class="pill fade-in"><span class="dot" aria-hidden="true"></span>{{ site.availability }}</p>
          <h1 id="hero-title" class="h1">
            @for (line of hero.lines; track line) {
              <span class="line"><span>{{ line }}</span></span>
            }
            <span class="line"><span class="serif accent-line">{{ hero.accentLine }}</span></span>
          </h1>
          <p class="lead fade-in d1">{{ hero.lead }}</p>
          <p class="intro fade-in d2">{{ hero.intro }}</p>
          <div class="actions fade-in d3">
            <button type="button" class="btn btn-primary" (click)="getInTouch.emit()">
              Get in touch <span class="arr" aria-hidden="true">→</span>
            </button>
            <a class="btn btn-ghost" href="#work">See selected work</a>
          </div>
          <div class="link-row fade-in d4">
            @for (link of site.links; track link.href) {
              <a class="link-u" [href]="link.href">{{ link.label }}</a>
            }
          </div>
        </div>

        <app-portrait-stage
          [alt]="hero.portraitAlt"
          [years]="hero.chips.years"
          [stack]="hero.chips.stack"
          [volume]="hero.chips.volume"
        />
      </div>
    </section>
  `,
  styleUrl: './hero.scss'
})
export class Hero {
  readonly getInTouch = output();
  protected readonly site = SITE;
  protected readonly hero = SITE.hero;
}

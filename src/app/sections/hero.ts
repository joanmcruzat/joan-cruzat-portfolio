import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Profile, profileLinks } from '../content/portfolio-content.model';
import { TrackDirective } from '../core/analytics/track.directive';
import { VisitorStats } from '../core/analytics/visitor-stats.store';
import { CountUp } from '../ui/count-up';
import { PortraitStage } from '../ui/portrait-stage';

@Component({
  selector: 'app-hero',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, PortraitStage, TrackDirective],
  template: `
    <section class="wrap" aria-labelledby="hero-title">
      <div class="hero-grid">
        <div>
          <!-- The row reserves room for the visitor pill, so it appearing after /api/visitors answers doesn't shift the page. -->
          <div class="pills">
            <p class="pill fade-in"><span class="dot" aria-hidden="true"></span>{{ profile().availability }}</p>
            @if (visitors(); as stats) {
              <p class="visitors fade-in">
                <span class="live-tag"><span class="dot live" aria-hidden="true"></span>Live</span>
                <span class="label">Site visitors</span>
                <app-count-up class="count" [to]="stats.visitors" />
              </p>
            }
          </div>
          <h1 id="hero-title" class="h1">
            @for (line of hero().lines; track line) {
              <span class="line"><span>{{ line }}</span></span>
            }
            <span class="line"><span class="serif accent-line">{{ hero().accentLine }}</span></span>
          </h1>
          <p class="lead fade-in d1">{{ hero().lead }}</p>
          <p class="intro fade-in d2">{{ hero().intro }}</p>
          <div class="actions fade-in d3">
            <button type="button" class="btn btn-primary" (click)="getInTouch.emit()">
              Get in touch <span class="arr" aria-hidden="true">→</span>
            </button>
            <a class="btn btn-ghost" href="#work">See selected work</a>
          </div>
          <div class="link-row fade-in d4">
            @for (link of links(); track link.href) {
              <a class="link-u" [href]="link.href" target="_blank" rel="noopener noreferrer"
                appTrack="profile_link_clicked" [trackProps]="{ link: link.id, location: 'hero' }">{{ link.label }}</a>
            }
          </div>
        </div>

        <app-portrait-stage
          [alt]="hero().portraitAlt"
          [years]="hero().chips.years"
          [stack]="hero().chips.stack"
          [volume]="hero().chips.volume"
        />
      </div>
    </section>
  `,
  styleUrl: './hero.scss'
})
export class Hero {
  readonly getInTouch = output();
  readonly profile = input.required<Profile>();
  /** Live count from /api/visitors; the pill appears once it answers. */
  readonly visitors = input<VisitorStats>();

  protected readonly hero = computed(() => this.profile().hero);
  protected readonly links = computed(() => profileLinks(this.profile()));
}

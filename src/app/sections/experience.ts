import { ChangeDetectionStrategy, Component } from '@angular/core';
import { EXPERIENCE } from '../content/experience';
import { SITE } from '../content/site';
import { STACK } from '../content/stack';
import { RevealDirective } from '../directives/reveal.directive';
import { CountUp } from '../ui/count-up';

@Component({
  selector: 'app-experience',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [CountUp, RevealDirective],
  template: `
    <section id="experience" class="section" aria-labelledby="experience-title">
      <div class="wrap">
        <h2 id="experience-title" class="eyebrow" appReveal>{{ copy.eyebrow }}</h2>
        <div class="grid">
          <div appReveal>
            <div class="big-num"><app-count-up [to]="years" /><span class="serif">+</span></div>
            <p class="caption">{{ copy.caption }}</p>
          </div>
          <ol class="timeline">
            @for (job of jobs; track job.id; let i = $index) {
              <li class="job" appReveal="left" [revealIndex]="i">
                <span class="mono period">{{ job.period }}</span>
                <div>
                  <h3>{{ job.role }}</h3>
                  <div class="co">{{ job.company }}</div>
                  <p>{{ job.description }}</p>
                </div>
              </li>
            }
          </ol>
        </div>

        <div class="stack">
          @for (group of stack; track group.title; let i = $index) {
            <div appReveal [revealIndex]="i % 3">
              <h3 class="mono">{{ group.title }}</h3>
              <p>
                @for (line of group.lines; track line; let last = $last) {
                  {{ line }}@if (!last) {<br />}
                }
              </p>
            </div>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './experience.scss'
})
export class Experience {
  protected readonly copy = SITE.experience;
  protected readonly years = SITE.yearsExperience;
  protected readonly jobs = EXPERIENCE;
  protected readonly stack = STACK;
}

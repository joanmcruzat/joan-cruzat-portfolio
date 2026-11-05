import { DecimalPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { Project } from '../../core/content/portfolio-content.model';
import { RevealDirective, staggerDelay } from '../../shared/motion/reveal.directive';

@Component({
  selector: 'app-projects-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [DecimalPipe, RevealDirective],
  template: `
    <section id="projects" class="section projects">
      <div class="section-label">03 / SELECTED WORK</div>
      <div class="section-head">
        <h2>Systems I've worked on.</h2>
        <span>REAL PROBLEMS · REAL SYSTEMS</span>
      </div>
      <div class="project-grid">
        @for (project of projects(); track project.title; let i = $index) {
          <article class="project" appReveal [revealY]="30" [revealDuration]="0.65" [revealDelay]="stagger(i)">
            <div class="project-no">{{ i + 1 | number: '2.0-0' }}</div>
            <div class="tag">{{ project.tag }}</div>
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            <div class="chips">
              @for (tech of project.tech; track tech) {
                <span>{{ tech }}</span>
              }
            </div>
            <a href="#contact">Explore case study →</a>
          </article>
        }
      </div>
    </section>
  `
})
export class ProjectsSection {
  readonly projects = input.required<readonly Project[]>();
  protected readonly stagger = staggerDelay;
}

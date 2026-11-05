import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RevealDirective, staggerDelay } from '../../shared/motion/reveal.directive';

const LAYERS = ['Angular Frontend', '.NET Web API', 'Application / Business Layer', 'Data Access Layer'];
const DEPENDENCIES = ['SQL Server / MySQL / PostgreSQL', 'Redis Cache', 'Third-Party APIs', 'AWS / Cloud Infrastructure'];

// Static diagram: it is layout, not content, so it is not stored in the database.
@Component({
  selector: 'app-architecture-section',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section class="section architecture">
      <div class="section-label">05 / ARCHITECTURE</div>
      <h2>A system view.</h2>
      <div class="arch">
        @for (layer of layers; track layer; let i = $index, first = $first) {
          @if (!first) {
            <div class="arrow">↓</div>
          }
          <div class="node" [class.frontend]="first" appReveal [revealY]="24" [revealDuration]="0.6" [revealDelay]="stagger(i)">{{ layer }}</div>
        }
        <div class="branch">
          @for (dependency of dependencies; track dependency; let i = $index) {
            <div class="node small" appReveal [revealY]="24" [revealDuration]="0.6" [revealDelay]="stagger(i)">{{ dependency }}</div>
          }
        </div>
        <div class="architecture-caption">
          <span>SECURE</span><span>SCALABLE</span><span>OBSERVABLE</span><span>TESTABLE</span>
        </div>
      </div>
    </section>
  `
})
export class ArchitectureSection {
  protected readonly layers = LAYERS;
  protected readonly dependencies = DEPENDENCIES;
  protected readonly stagger = staggerDelay;
}

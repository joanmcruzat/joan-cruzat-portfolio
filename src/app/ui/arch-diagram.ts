import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The "typical system I build" illustration, top to bottom. Drawn like a picture, so it lives with the component. */
const ARCHITECTURE = {
  label: 'A typical system I build',
  ariaLabel:
    'Typical system architecture: Angular frontend, .NET Web API, business layer, data access, then databases, cache and third-party APIs on AWS',
  nodes: [
    { label: 'Angular frontend', layer: 'UI' },
    { label: '.NET Web API', layer: 'REST' },
    { label: 'Application / business layer', layer: 'DOMAIN' },
    { label: 'Data access layer', layer: 'EF · SQL' }
  ],
  leaves: [
    ['SQL Server', 'MySQL · Postgres'],
    ['Redis', 'cache'],
    ['Third-party', 'APIs']
  ],
  cloud: 'AWS · cloud infrastructure',
  qualities: ['Secure', 'Scalable', 'Observable', 'Testable']
} as const;

@Component({
  selector: 'app-arch-diagram',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: { role: 'img', '[attr.aria-label]': 'diagram.ariaLabel' },
  template: `
    <div class="mono label">{{ diagram.label }}</div>
    @for (node of diagram.nodes; track node.label) {
      <div class="node">{{ node.label }}<small>{{ node.layer }}</small></div>
      <div class="flow" aria-hidden="true"></div>
    }
    <div class="leaf-grid">
      @for (leaf of diagram.leaves; track leaf[0]) {
        <div class="leaf">{{ leaf[0] }}<br />{{ leaf[1] }}</div>
      }
    </div>
    <div class="cloud mono">{{ diagram.cloud }}</div>
    <div class="qual mono">
      @for (quality of diagram.qualities; track quality) {
        <span>{{ quality }}</span>
      }
    </div>
  `,
  styleUrl: './arch-diagram.scss'
})
export class ArchDiagram {
  protected readonly diagram = ARCHITECTURE;
}

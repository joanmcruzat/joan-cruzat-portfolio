import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ARCHITECTURE } from '../content/principles';

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

import { NgOptimizedImage } from '@angular/common';
import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { HeroChip } from '../content/portfolio-content.model';

@Component({
  selector: 'app-portrait-stage',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgOptimizedImage],
  template: `
    <div class="arch" aria-hidden="true"></div>
    <div class="ring" aria-hidden="true"></div>
    <div class="float">
      <img class="portrait" ngSrc="assets/images/joan-portrait.webp" width="760" height="1039" priority [alt]="alt()" />
    </div>
    <div class="chip chip-a"><b>{{ years().value }}</b><span class="chip-label">{{ years().label }}</span></div>
    <div class="chip chip-b"><span class="mono code" aria-hidden="true">&lt;/&gt;</span><span>{{ stack() }}</span></div>
    <div class="chip chip-c"><b>{{ volume().value }}</b><span class="chip-label">{{ volume().label }}</span></div>
  `,
  styleUrl: './portrait-stage.scss'
})
export class PortraitStage {
  readonly alt = input.required<string>();
  readonly years = input.required<HeroChip>();
  readonly stack = input.required<string>();
  readonly volume = input.required<HeroChip>();
}

import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Profile, profileLinks, SectionCopy } from '../content/portfolio-content.model';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="contact" aria-labelledby="contact-title">
      <div class="wrap inner" appReveal>
        <p class="eyebrow">{{ copy().eyebrow }}</p>
        <h2 id="contact-title" class="h2 title pre-line">{{ copy().before }}<span class="serif">{{ copy().accent }}</span>{{ copy().after }}</h2>
        <p class="text">{{ copy().body }}</p>
        <a class="mail" [href]="'mailto:' + profile().email">{{ profile().email }} <span class="arr" aria-hidden="true">↗</span></a>
        <div class="link-row">
          @for (link of links(); track link.href) {
            <a class="link-u" [href]="link.href" target="_blank" rel="noopener noreferrer">{{ link.label }}</a>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './contact.scss'
})
export class Contact {
  readonly copy = input.required<SectionCopy>();
  readonly profile = input.required<Profile>();

  protected readonly links = computed(() => profileLinks(this.profile()));
}

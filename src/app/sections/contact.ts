import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SITE } from '../content/site';
import { RevealDirective } from '../directives/reveal.directive';

@Component({
  selector: 'app-contact',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [RevealDirective],
  template: `
    <section id="contact" aria-labelledby="contact-title">
      <div class="wrap inner" appReveal>
        <p class="eyebrow">{{ copy.eyebrow }}</p>
        <h2 id="contact-title" class="h2 title">
          {{ copy.lineOne }}<br />{{ copy.lineTwoBefore }}<span class="serif">{{ copy.accent }}</span>
        </h2>
        <p class="text">{{ copy.text }}</p>
        <a class="mail" [href]="'mailto:' + site.email">{{ site.email }} <span class="arr" aria-hidden="true">↗</span></a>
        <div class="link-row">
          @for (link of site.links; track link.href) {
            <a class="link-u" [href]="link.href">{{ link.label }}</a>
          }
        </div>
      </div>
    </section>
  `,
  styleUrl: './contact.scss'
})
export class Contact {
  protected readonly site = SITE;
  protected readonly copy = SITE.contact;
}

import { NgTemplateOutlet } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { Project } from '../content/portfolio-content.model';

@Component({
  selector: 'app-project-row',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [NgTemplateOutlet],
  template: `
    <ng-template #body>
      <span class="num mono">{{ number() }}</span>
      <div>
        <div class="cat mono">{{ project().category }}</div>
        <h3 class="title">{{ project().title }}</h3>
      </div>
      <div>
        <p>{{ project().description }}</p>
        <div class="tags">
          @for (tag of project().tags; track tag) {
            <span class="tag">{{ tag }}</span>
          }
        </div>
      </div>
      <div class="result">
        @switch (project().result.kind) {
          @case ('metric') {
            <b>{{ metric()?.value }}</b><span>{{ metric()?.label }}</span>
          }
          @default {
            <div class="soft">{{ note() }}</div>
          }
        }
      </div>
    </ng-template>

    @if (project().caseStudyUrl; as url) {
      <a class="row" [href]="url"><ng-container [ngTemplateOutlet]="body" /></a>
    } @else {
      <div class="row"><ng-container [ngTemplateOutlet]="body" /></div>
    }
  `,
  styleUrl: './project-row.scss'
})
export class ProjectRow {
  readonly project = input.required<Project>();
  readonly index = input.required<number>();

  protected readonly number = computed(() => String(this.index() + 1).padStart(2, '0'));
  protected readonly metric = computed(() => {
    const result = this.project().result;
    return result.kind === 'metric' ? result : null;
  });
  protected readonly note = computed(() => {
    const result = this.project().result;
    return result.kind === 'note' ? result.text : '';
  });
}

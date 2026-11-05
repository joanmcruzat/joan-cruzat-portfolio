import { Profile } from '../../core/content/portfolio-content.model';

export interface CodeToken {
  readonly kind: '' | 'kw' | 'num' | 'str';
  readonly text: string;
}

export type CodeLine = readonly CodeToken[];

function chunk(items: readonly string[], size: number): string[][] {
  const rows: string[][] = [];
  for (let i = 0; i < items.length; i += size) rows.push(items.slice(i, i + size));
  return rows;
}

// One indented row of string literals, with commas between items and after the row
// unless it holds the array's last item.
function arrayRows(items: readonly string[], perRow: number): CodeLine[] {
  const rows = chunk(items, perRow);
  return rows.map((row, rowIndex) => {
    const tokens: CodeToken[] = [{ kind: '', text: '    ' }];
    row.forEach((item, i) => {
      tokens.push({ kind: 'str', text: `"${item}"` });
      const isLastInRow = i === row.length - 1;
      const isLastOverall = isLastInRow && rowIndex === rows.length - 1;
      if (!isLastOverall) tokens.push({ kind: '', text: isLastInRow ? ',' : ', ' });
    });
    return tokens;
  });
}

// The hero terminal shows the profile as a hand-formatted object literal:
// focus items two per line, mindset items one per line.
export function engineerSnippet(profile: Profile): CodeLine[] {
  return [
    [{ kind: 'kw', text: 'const' }, { kind: '', text: ' engineer = {' }],
    [{ kind: '', text: '  experience: ' }, { kind: 'num', text: `"${profile.yearsExperience} years"` }, { kind: '', text: ',' }],
    [{ kind: '', text: '  focus: [' }],
    ...arrayRows(profile.focus, 2),
    [{ kind: '', text: '  ],' }],
    [{ kind: '', text: '  mindset: [' }],
    ...arrayRows(profile.mindset, 1),
    [{ kind: '', text: '  ]' }],
    [{ kind: '', text: '};' }]
  ];
}

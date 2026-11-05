import { buildProfile } from '../../../testing/portfolio-content.fixture';
import { CodeLine, engineerSnippet } from './engineer-snippet';

function asText(lines: CodeLine[]): string {
  return lines.map((line) => line.map((token) => token.text).join('')).join('\n');
}

describe('engineerSnippet', () => {
  it('formats the profile as an object literal with focus pairs and one mindset per line', () => {
    const profile = buildProfile({ yearsExperience: '8+', focus: ['.NET', 'Angular', 'APIs'], mindset: ['reliable', 'scalable'] });

    expect(asText(engineerSnippet(profile))).toBe([
      'const engineer = {',
      '  experience: "8+ years",',
      '  focus: [',
      '    ".NET", "Angular",',
      '    "APIs"',
      '  ],',
      '  mindset: [',
      '    "reliable",',
      '    "scalable"',
      '  ]',
      '};'
    ].join('\n'));
  });

  it('marks string literals for syntax highlighting', () => {
    const profile = buildProfile({ focus: ['.NET'], mindset: [] });

    const strings = engineerSnippet(profile).flat().filter((token) => token.kind === 'str');

    expect(strings.map((token) => token.text)).toEqual(['".NET"']);
  });
});

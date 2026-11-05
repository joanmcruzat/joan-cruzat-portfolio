import { HttpErrorResponse } from '@angular/common/http';
import { problemDetail } from './problem-details';

describe('problemDetail', () => {
  it('returns the detail of a problem response', () => {
    const error = new HttpErrorResponse({ status: 400, error: { title: 'Bad Request', status: 400, detail: 'Please send a message.' } });

    expect(problemDetail(error, 'fallback')).toBe('Please send a message.');
  });

  it('falls back when the response has no detail', () => {
    const error = new HttpErrorResponse({ status: 500, error: 'Internal error' });

    expect(problemDetail(error, 'fallback')).toBe('fallback');
  });

  it('falls back on network failures', () => {
    const error = new HttpErrorResponse({ status: 0, error: new ProgressEvent('error') });

    expect(problemDetail(error, 'fallback')).toBe('fallback');
  });

  it('falls back for non-HTTP errors', () => {
    expect(problemDetail(new Error('boom'), 'fallback')).toBe('fallback');
  });
});

import { HttpErrorResponse } from '@angular/common/http';

// Returns the visitor-safe `detail` of an RFC 9457 problem response, or the fallback.
export function problemDetail(error: unknown, fallback: string): string {
  if (error instanceof HttpErrorResponse && error.status > 0) {
    const body: unknown = error.error;
    if (typeof body === 'object' && body !== null && 'detail' in body && typeof body.detail === 'string') {
      return body.detail;
    }
  }
  return fallback;
}

import { AfterViewInit, Component, HostListener, OnDestroy } from '@angular/core';
import { animate, inView, stagger } from 'motion';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit, OnDestroy {
  dark = true;
  menuOpen = false;
  hireOpen = false;
  sending = false;
  sent = false;
  error = '';
  private motionCleanups: Array<() => void> = [];

  inquiry = {
    name: '', company: '', email: '', role: '', message: '',
    budget: '', website: '', companyFax: ''
  };

  skills = ['.NET', 'C#', 'Angular', 'TypeScript', 'REST APIs', 'SQL Server',
    'MySQL', 'PostgreSQL', 'EF Core', 'Microservices', 'AWS', 'Redis', 'CI/CD', 'Playwright'];

  projects = [
    { title: 'Moolah Play / MarkerTrax', tag: 'Operator Platform',
      desc: 'Angular operator dashboard with reporting, graphs, user management, settings and REST API integration.',
      tech: ['Angular', 'TypeScript', 'REST APIs', 'Data Visualization'] },
    { title: 'Uniteller Remittance Integration', tag: 'Fintech',
      desc: 'Third-party financial integration involving signup, KYC, MFA, Plaid and backend service workflows.',
      tech: ['.NET', 'REST APIs', 'Plaid', 'KYC', 'MFA'] },
    { title: 'NMI Payment Gateway', tag: 'Payments',
      desc: 'Payment gateway integration covering card management, vault concepts, transaction processing and database design.',
      tech: ['.NET', 'Payment APIs', 'SQL', 'Security'] },
    { title: 'Usio GPR / Akimbo', tag: 'Financial Services',
      desc: 'Card integration with SSO, token handling and coordinated frontend/backend architecture.',
      tech: ['.NET', 'Angular', 'SSO', 'API Integration'] },
    { title: 'Bloxcross Crypto Integration', tag: 'API Security',
      desc: 'Secure service integration using HMAC authentication, JWT, API logging, validation and error handling.',
      tech: ['.NET 8', 'HMAC', 'JWT', 'Microservices'] },
    { title: 'Academic Information Management', tag: 'Education',
      desc: 'Database-driven academic information systems built through full-stack PHP development.',
      tech: ['PHP', 'JavaScript', 'HTML', 'SQL'] }
  ];


  ngAfterViewInit() {
    // Motion is intentionally used for restrained, editorial movement rather
    // than constant effects. It preserves the existing content and links.
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) return;

    const runOnceInView = (selector: string, y = 28, duration = 0.72) => {
      const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
      elements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = `translateY(${y}px)`;
        const cleanup = inView(element, () => {
          animate(
            element,
            { opacity: 1, y: 0 },
            {
              duration,
              delay: Math.min(index * 0.045, 0.22),
              ease: [0.22, 1, 0.36, 1]
            }
          );
        });
        this.motionCleanups.push(cleanup);
      });
    };

    const heroCopy = document.querySelector<HTMLElement>('.hero-copy');
    const heroVisual = document.querySelector<HTMLElement>('.hero-visual');

    if (heroCopy) {
      heroCopy.style.opacity = '0';
      heroCopy.style.transform = 'translateY(24px)';
      animate(
        heroCopy,
        { opacity: 1, y: 0 },
        { duration: 0.85, ease: [0.22, 1, 0.36, 1] }
      );
    }

    if (heroVisual) {
      heroVisual.style.opacity = '0';
      heroVisual.style.transform = 'translateY(18px)';
      animate(
        heroVisual,
        { opacity: 1, y: 0 },
        { duration: 0.9, delay: 0.12, ease: [0.22, 1, 0.36, 1] }
      );
    }

    const badge = document.querySelector<HTMLElement>('.experience-badge');
    if (badge) {
      animate(
        badge,
        { y: [8, 0], scale: [0.97, 1] },
        { duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }
      );
    }

    const terminal = document.querySelector<HTMLElement>('.terminal');
    if (terminal) {
      animate(
        terminal,
        { rotateX: [2, 0], scale: [0.985, 1] },
        { duration: 1, delay: 0.18, ease: [0.22, 1, 0.36, 1] }
      );
    }

    runOnceInView('#about', 34, 0.8);
    runOnceInView('#experience .timeline article', 30, 0.7);
    runOnceInView('#projects .project', 30, 0.65);
    runOnceInView('#engineering .principles article', 24, 0.6);
    runOnceInView('#skills .skill-cloud span', 18, 0.5);
    runOnceInView('#skills .quality > div', 24, 0.65);
    runOnceInView('.architecture .node', 24, 0.6);
    runOnceInView('#contact .contact-box', 30, 0.75);

    const ticker = document.querySelector<HTMLElement>('.ticker');
    if (ticker) {
      const items = Array.from(ticker.children) as HTMLElement[];
      items.forEach((item) => {
        item.style.opacity = '0';
      });
      animate(
        items,
        { opacity: 1 },
        { delay: stagger(0.06, { startDelay: 0.45 }), duration: 0.45 }
      );
    }

    const nav = document.querySelector<HTMLElement>('.nav');
    if (nav) {
      animate(
        nav,
        { y: [-10, 0], opacity: [0, 1] },
        { duration: 0.55, ease: [0.22, 1, 0.36, 1] }
      );
    }
  }

  ngOnDestroy() {
    this.motionCleanups.forEach((cleanup) => cleanup());
    this.motionCleanups = [];
  }

  toggleTheme() {
    this.dark = !this.dark;
    document.documentElement.classList.toggle('light', !this.dark);
    localStorage.setItem('portfolio-theme', this.dark ? 'dark' : 'light');
  }

  openHire() {
    this.hireOpen = true;
    this.sent = false;
    this.error = '';
  }

  closeHire() {
    if (!this.sending) this.hireOpen = false;
  }

  async submitInquiry() {
    if (this.inquiry.companyFax) { this.sent = true; return; }
    if (!this.inquiry.name || !this.inquiry.company || !this.inquiry.email ||
        !this.inquiry.role || !this.inquiry.message) {
      this.error = 'Please complete all required fields.';
      return;
    }

    this.sending = true;
    this.error = '';

    // Replace with your secure backend/Resend/Formspree endpoint.
    // Never place an API key in this Angular application.
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.inquiry)
      });
      if (!response.ok) throw new Error('Request failed');
      this.sent = true;
      this.inquiry = { name:'', company:'', email:'', role:'', message:'', budget:'', website:'', companyFax:'' };
    } catch {
      this.error = 'Unable to send right now. Please use the email or LinkedIn option below.';
    } finally {
      this.sending = false;
    }
  }

  scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    this.menuOpen = false;
  }

  constructor() {
    const saved = localStorage.getItem('portfolio-theme');
    if (saved === 'light') {
      this.dark = false;
      document.documentElement.classList.add('light');
    } else {
      this.dark = true;
      document.documentElement.classList.remove('light');
    }
  }

  @HostListener('document:keydown.escape')
  escape() { this.closeHire(); }
}
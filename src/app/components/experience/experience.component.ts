import { Component, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Experience {
  title: string;
  company: string;
  date: string;
  logo: string;
  bullets: string[];
}

@Component({
  selector: 'app-experience',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './experience.component.html',
  styleUrl: './experience.component.scss',
})
export class ExperienceComponent implements AfterViewInit {
  experiences: Experience[] = [
    {
      title: 'Software Development Intern',
      company: 'GEICO',
      date: 'June 2025 - Present',
      logo: '/assets/images/experience/geico.png',
      bullets: [
        'Designed and built an internal PDLC orchestration platform using Figma, Django, GraphQL, PostgreSQL, and React/TypeScript to streamline developer workflows and accelerate project creation across a team of 3500+ engineers',
        'Developed a REST API aligned with internal company procedures, incorporating Shift Left principles to reduce 27% of developer bottlenecks through earlier reviews, testing, and standardized processes',
        'Integrated communication and automation features using Azure DevOps, Slack, and Office 365 APIs, enabling DevOps ticket generation and improving cross-team visibility',
        'Implemented LLM-based risk categorization with Google Gemini API to proactively flag high-risk projects and enhance product creation planning',
      ],
    },
    {
      title: 'Software Intern',
      company: 'E42.ai',
      date: 'June 2024 - August 2024',
      logo: '/assets/images/experience/e42ai.png',
      bullets: [
        "Utilized the company's platform to configure virtual AI workers for automating human resource processes",
        'Tested the company’s generative AI model for accuracy using training documents and refined its responses',
        'Built an MLOps pipeline simulating natural language-to-SQL with LLMs; generated fake employee datasets (e.g. name, address, phone number, etc.) with Python/Faker, stored in MySQL, used ChromaDB for SQL retrieval, and ChatDB to convert query results into English answers',
      ],
    },
    {
      title: 'Research Assistant',
      company: 'UIUC',
      date: '2023 - Present',
      logo: '/assets/images/experience/uiuc.png',
      bullets: [
        'Working on research projects related to computer science. Developing algorithms and implementing solutions for real-world problems.',
      ],
    },
  ];

  activeIndex = 0;

  @ViewChild('timeline', { static: false }) timelineRef!: ElementRef;
  @ViewChild('cardRow', { static: false }) cardRowRef!: ElementRef;

  ngAfterViewInit() {
    this.scrollTimelineToActive();
    this.scrollCardRowToActive();
  }

  goTo(index: number) {
    this.activeIndex = index;
    this.scrollTimelineToActive();
    this.scrollCardRowToActive();
  }

  prev() {
    if (this.activeIndex > 0) {
      this.activeIndex--;
      this.scrollTimelineToActive();
      this.scrollCardRowToActive();
    }
  }

  next() {
    if (this.activeIndex < this.experiences.length - 1) {
      this.activeIndex++;
      this.scrollTimelineToActive();
      this.scrollCardRowToActive();
    }
  }

  scrollTimelineToActive() {
    setTimeout(() => {
      const timeline = this.timelineRef?.nativeElement;
      const items = timeline?.querySelectorAll('.timeline-item');
      if (timeline && items && items[this.activeIndex]) {
        const item = items[this.activeIndex];
        const itemRect = item.getBoundingClientRect();
        const timelineRect = timeline.getBoundingClientRect();
        const scrollLeft =
          item.offsetLeft -
          timeline.offsetLeft -
          timelineRect.width / 2 +
          itemRect.width / 2;
        timeline.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }, 0);
  }

  scrollCardRowToActive() {
    setTimeout(() => {
      const cardRow = this.cardRowRef?.nativeElement;
      const cards = cardRow?.children;
      if (cardRow && cards && cards[this.activeIndex + 1]) {
        // +1 for left spacer
        const card = cards[this.activeIndex + 1];
        const cardRect = card.getBoundingClientRect();
        const rowRect = cardRow.getBoundingClientRect();
        const scrollLeft =
          card.offsetLeft -
          cardRow.offsetLeft -
          rowRect.width / 2 +
          cardRect.width / 2;
        cardRow.scrollTo({ left: scrollLeft, behavior: 'smooth' });
      }
    }, 0);
  }

  onCardRowScroll() {
    const cardRow = this.cardRowRef?.nativeElement;
    if (!cardRow) return;
    const cards = cardRow.children;
    const rowRect = cardRow.getBoundingClientRect();
    let minDiff = Infinity;
    let closestIdx = 0;
    // Only consider actual experience cards (skip first and last spacer)
    for (let i = 1; i < cards.length - 1; i++) {
      const cardRect = cards[i].getBoundingClientRect();
      const cardCenter = cardRect.left + cardRect.width / 2;
      const rowCenter = rowRect.left + rowRect.width / 2;
      const diff = Math.abs(cardCenter - rowCenter);
      if (diff < minDiff) {
        minDiff = diff;
        closestIdx = i - 1; // -1 to map to experiences index
      }
    }
    if (this.activeIndex !== closestIdx) {
      this.activeIndex = closestIdx;
      this.scrollTimelineToActive();
    }
  }
}

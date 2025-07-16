// Angular core imports for component creation, DOM access, lifecycle hooks, and event listening
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
} from '@angular/core';
// Import CommonModule to enable *ngFor, *ngIf, etc. in standalone components
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects', // The HTML tag for this component
  imports: [CommonModule], // Import CommonModule for structural directives
  templateUrl: './projects.component.html', // Path to the HTML template
  styleUrl: './projects.component.scss', // Path to the SCSS styles
})
export class ProjectsComponent implements AfterViewInit {
  // Reference to the carousel container in the template (with #carousel)
  @ViewChild('carousel', { static: false })
  carouselRef!: ElementRef<HTMLDivElement>;

  // List of all projects to display in the carousel
  projects = [
    {
      title: 'Todo App',
      description:
        'A full-stack todo application built with Angular and Node.js',
      image: '',
      tags: ['Angular', 'TypeScript'],
    },
    {
      title: 'E-commerce Platform',
      description: 'Modern e-commerce solution with React and Django',
      image: '',
      tags: ['React', 'Django'],
    },
    {
      title: 'Portfolio Website',
      description: 'Personal portfolio built with Angular and Tailwind CSS',
      image: '',
      tags: ['Angular', 'Tailwind'],
    },
    // Add more projects as needed
  ];

  // Number of cards visible at once (calculated based on container width)
  visibleCards = 3;

  // Array of projects to render, including clones at start/end for infinite looping
  loopedProjects: any[] = [];

  // Width of each card in pixels (used for scroll calculations)
  cardWidth = 320;

  // Lifecycle hook: runs after the component's view is initialized
  ngAfterViewInit() {
    this.updateVisibleCards(); // Calculate how many cards fit in the container
    this.setupLoopedProjects(); // Set up the loopedProjects array with clones for looping
    // setTimeout(() => this.scrollToRealStart(), 0); // (Commented for debug) Would scroll to the first real card
  }

  // Listen for window resize events to recalculate layout
  @HostListener('window:resize')
  onResize() {
    this.updateVisibleCards(); // Recalculate visible cards
    this.setupLoopedProjects(); // Re-setup the looped array
    // setTimeout(() => this.scrollToRealStart(), 0); // (Commented for debug)
  }

  // Calculates how many cards fit in the carousel container
  updateVisibleCards() {
    if (!this.carouselRef) return;
    const containerWidth = this.carouselRef.nativeElement.offsetWidth;
    // Ensure at least 1 card is visible
    this.visibleCards = Math.max(
      1,
      Math.floor(containerWidth / this.cardWidth)
    );
  }

  // Sets up the loopedProjects array for infinite looping
  // Clones the last N and first N cards to the start/end
  setupLoopedProjects() {
    const n = this.visibleCards;
    const len = this.projects.length;
    this.loopedProjects = [
      ...this.projects.slice(len - n, len), // Clone last N cards to the start
      ...this.projects, // All real projects
      ...this.projects.slice(0, n), // Clone first N cards to the end
    ];
  }

  // Scrolls to the first real card (after the prepended clones)
  scrollToRealStart() {
    if (!this.carouselRef) return;
    const n = this.visibleCards;
    this.carouselRef.nativeElement.scrollLeft = n * this.cardWidth;
  }

  // Handles scroll events for infinite looping
  // If user scrolls into the clones, instantly jump to the real start/end
  onScroll() {
    if (!this.carouselRef) return;
    const n = this.visibleCards;
    const total = this.projects.length;
    const scrollLeft = this.carouselRef.nativeElement.scrollLeft;
    const maxScroll = (total + n) * this.cardWidth;
    if (scrollLeft < 1) {
      // Scrolled to the left clones, jump to real end
      this.carouselRef.nativeElement.scrollLeft = total * this.cardWidth;
    } else if (scrollLeft >= maxScroll) {
      // Scrolled to the right clones, jump to real start
      this.carouselRef.nativeElement.scrollLeft = n * this.cardWidth;
    }
  }
}

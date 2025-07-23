// Angular core imports for component creation, DOM access, lifecycle hooks, and event listening
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  HostListener,
  OnDestroy,
} from '@angular/core';
// Import CommonModule to enable *ngFor, *ngIf, etc. in standalone components
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects', // The HTML tag for this component
  imports: [CommonModule], // Import CommonModule for structural directives
  templateUrl: './projects.component.html', // Path to the HTML template
  styleUrl: './projects.component.scss', // Path to the SCSS styles
})
export class ProjectsComponent implements AfterViewInit, OnDestroy {
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
    {
      title: 'Weather Dashboard',
      description: 'Real-time weather tracking with interactive maps',
      image: '',
      tags: ['React', 'API', 'Maps'],
    },
  ];

  // Number of cards visible at once (calculated based on container width)
  visibleCards = 3;

  // Array of projects to render for infinite scrolling
  displayProjects: any[] = [];

  // Width of each card in pixels (used for scroll calculations)
  cardWidth = 320;

  // Auto-scroll interval
  private autoScrollInterval: any;
  private scrollSpeed = 3; // pixels per frame - increased for faster scrolling
  private isScrolling = true;

  // Lifecycle hook: runs after the component's view is initialized
  ngAfterViewInit() {
    this.updateVisibleCards(); // Calculate how many cards fit in the container
    this.initializeInfiniteScroll(); // Set up the infinite scroll system
    this.startAutoScroll(); // Start automatic scrolling
  }

  // Clean up interval when component is destroyed
  ngOnDestroy() {
    this.stopAutoScroll();
  }

  // Listen for window resize events to recalculate layout
  @HostListener('window:resize')
  onResize() {
    this.updateVisibleCards(); // Recalculate visible cards
    this.initializeInfiniteScroll(); // Re-setup the infinite scroll
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

  // Initialize the infinite scroll system
  initializeInfiniteScroll() {
    // Only append the first N items (N = visibleCards) for seamless infinite scroll
    this.displayProjects = [
      ...this.projects,
      ...this.projects.slice(0, this.visibleCards),
    ];
  }

  // Start automatic scrolling
  startAutoScroll() {
    this.stopAutoScroll(); // Clear any existing interval
    this.isScrolling = true;

    this.autoScrollInterval = setInterval(() => {
      if (!this.isScrolling || !this.carouselRef) return;

      const carousel = this.carouselRef.nativeElement;
      carousel.scrollLeft += this.scrollSpeed;

      // Check if we need to reset scroll position for infinite effect
      this.checkAndResetScroll();
    }, 16); // ~60fps
  }

  // Stop automatic scrolling
  stopAutoScroll() {
    if (this.autoScrollInterval) {
      clearInterval(this.autoScrollInterval);
      this.autoScrollInterval = null;
    }
    this.isScrolling = false;
  }

  // Check if we need to reset scroll position for infinite effect
  checkAndResetScroll() {
    if (!this.carouselRef) return;

    const carousel = this.carouselRef.nativeElement;
    const totalWidth = this.projects.length * this.cardWidth;

    if (carousel.scrollLeft >= totalWidth) {
      // Disable smooth scrolling
      carousel.classList.add('no-transition');
      // Instantly jump to the equivalent position at the start of the original set
      carousel.scrollLeft = carousel.scrollLeft - totalWidth;
      // Re-enable smooth scrolling on the next frame
      requestAnimationFrame(() => {
        carousel.classList.remove('no-transition');
      });
    }
  }

  // Pause scrolling on hover
  onMouseEnter() {
    this.isScrolling = false;
  }

  // Resume scrolling when mouse leaves
  onMouseLeave() {
    this.isScrolling = true;
  }
}

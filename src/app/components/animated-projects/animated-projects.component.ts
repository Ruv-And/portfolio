// Angular core imports for component creation, DOM access, lifecycle hooks, and input properties
import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewInit,
  OnDestroy,
  Input,
} from '@angular/core';
// Import CommonModule to enable *ngFor, *ngIf, etc. in standalone components
import { CommonModule } from '@angular/common';
// Import GSAP and Observer for animation and drag/scroll interaction
import gsap from 'gsap';
import { Observer } from 'gsap/Observer';

// Register the Observer plugin with GSAP
gsap.registerPlugin(Observer);

// Interface for a single scroll item
interface InfiniteScrollItem {
  title: string;
  description: string;
  tags: string[];
  image?: string; // Optional image URL
  link?: string; // Optional link URL
}

// Component decorator defines metadata for the Angular component
@Component({
  selector: 'app-animated-projects', // The HTML tag for this component
  standalone: true, // Allows this component to be used without being declared in a module
  imports: [CommonModule], // Import CommonModule for structural directives
  templateUrl: './animated-projects.component.html', // Path to the HTML template
  styleUrl: './animated-projects.component.scss', // Path to the SCSS styles
})
export class AnimatedProjectsComponent implements AfterViewInit, OnDestroy {
  // Reference to the container div in the template (with #container)
  @ViewChild('container', { static: false })
  containerRef!: ElementRef<HTMLDivElement>;
  // Reference to the wrapper div in the template (with #wrapper)
  @ViewChild('wrapper', { static: false })
  wrapperRef!: ElementRef<HTMLDivElement>;

  // Input properties for configuration (can be set from parent)
  @Input() width: string = '40rem'; // Width of the scroll container
  @Input() maxHeight: string = '100%'; // Max height of the scroll area
  @Input() negativeMargin: string = '-0.5em'; // Negative margin between items
  @Input() items: InfiniteScrollItem[] = [
  ];
  @Input() itemMinHeight: number = 400; // Minimum height for each item
  @Input() isTilted: boolean = true; // Whether to apply tilt effect
  @Input() tiltDirection: 'left' | 'right' = 'left'; // Direction of tilt
  @Input() autoplay: boolean = true; // Whether to auto-scroll
  @Input() autoplaySpeed: number = 0.1; // Speed of auto-scroll
  // @Input() autoplayDirection: 'down' | 'up' = 'down'; // Direction of auto-scroll
  @Input() autoplayDirection: 'left' | 'right' = 'right'; // Direction of auto-scroll
  @Input() pauseOnHover: boolean = true; // Whether to pause on hover
  @Input() itemSpacing: number = 20; //space between items in px

  // Internal references for GSAP observer and animation frame
  private observer: any;
  private rafId: any;

  // Returns the CSS transform string for tilt effect
  getTiltTransform(): string {
    if (!this.isTilted) return 'none';
    return this.tiltDirection === 'left'
      ? 'rotateX(20deg) rotateZ(-20deg) skewX(20deg)'
      : 'rotateX(20deg) rotateZ(20deg) skewX(-20deg)';
  }

  visitProject(url: string, event: MouseEvent) {
    event.stopPropagation(); // Prevents triggering the card's click/drag
    window.open(url, '_blank', 'noopener');
  }

  // Lifecycle hook: runs after the component's view is initialized
  ngAfterViewInit() {
    const container = this.containerRef?.nativeElement;
    if (!container) return;
    if (this.items.length === 0) return;

    // Get all child divs (the scroll items)
    const divItems = Array.from(container.children) as HTMLDivElement[];
    if (!divItems.length) return;

    // Calculate item and container dimensions
    const firstItem = divItems[0];
    const itemStyle = getComputedStyle(firstItem);
    const itemHeight = firstItem.offsetHeight;
    const itemMarginTop = parseFloat(itemStyle.marginTop) || 0;
    const totalItemHeight = itemHeight + itemMarginTop;
    const totalHeight =
      itemHeight * this.items.length + itemMarginTop * (this.items.length - 1);
    const itemWidth = firstItem.offsetWidth;
    const itemMarginRight = parseFloat(itemStyle.marginRight) || 0;
    const totalItemWidth = itemWidth + itemMarginRight;
    const totalWidth = totalItemWidth * divItems.length;
    // itemWidth * this.items.length + itemMarginRight * (this.items.length - 1);

    // GSAP wrap function for infinite looping
    // const wrapFn = gsap.utils.wrap(-totalHeight, totalHeight);
    const wrapFn = gsap.utils.wrap(-totalWidth, totalWidth);
    // Set initial y position for each item
    divItems.forEach((child, i) => {
      // const y = i * totalItemHeight;
      // gsap.set(child, { y });
      const x = i * totalItemWidth;
      gsap.set(child, { x });
    });

    // Create GSAP Observer for drag/scroll interaction
    this.observer = Observer.create({
      target: container,
      type: 'wheel,touch,pointer',
      // preventDefault: true,
      onPress: ({ target }: any) => {
        (target as HTMLElement).style.cursor = 'grabbing';
      },
      onRelease: ({ target }: any) => {
        (target as HTMLElement).style.cursor = 'grab';
      },
      // // onChange: ({ deltaY, isDragging, event }: any) => {
      // onChange: ({ deltaX, isDragging, event }: any) => {
      //   // const d = event.type === 'wheel' ? -deltaY : deltaY;
      //   const d = event.type === 'wheel' ? -deltaX : deltaX;
      //   const distance = isDragging ? d * 5 : d * 10;
      //   divItems.forEach((child) => {
      //     gsap.to(child, {
      //       duration: 0.5,
      //       ease: 'expo.out',
      //       // y: `+=${distance}`,
      //       x: `+=${distance}`,
      //       modifiers: {
      //         // y: gsap.utils.unitize(wrapFn),
      //         x: gsap.utils.unitize(wrapFn),
      //       },
      //     });
      //   });
      // },
      onChange: ({ deltaX, deltaY, isDragging, event }: any) => {
        const isHorizontalScroll =
          event.type === 'wheel' ? Math.abs(deltaX) > Math.abs(deltaY) : true;

        if (!isHorizontalScroll) return; // Let vertical scroll happen naturally

        event.preventDefault(); // Only stop if user is scrolling sideways

        const d = event.type === 'wheel' ? -deltaX : deltaX;
        const distance = isDragging ? d * 5 : d * 10;

        divItems.forEach((child) => {
          gsap.to(child, {
            duration: 0.5,
            ease: 'expo.out',
            x: `+=${distance}`,
            modifiers: {
              x: gsap.utils.unitize(wrapFn),
            },
          });
        });
      },
    });

    // Autoplay logic (auto-scroll)
    if (this.autoplay) {
      // const directionFactor = this.autoplayDirection === 'down' ? 1 : -1;
      const directionFactor = this.autoplayDirection === 'right' ? 1 : -1;
      const speedPerFrame = this.autoplaySpeed * directionFactor;

      const tick = () => {
        divItems.forEach((child) => {
          gsap.set(child, {
            // y: `+=${speedPerFrame}`,
            x: `+=${speedPerFrame}`,
            modifiers: {
              // y: gsap.utils.unitize(wrapFn),
              x: gsap.utils.unitize(wrapFn),
            },
          });
        });
        this.rafId = requestAnimationFrame(tick);
      };

      this.rafId = requestAnimationFrame(tick);

      // Pause/resume on hover
      if (this.pauseOnHover) {
        const stopTicker = () => this.rafId && cancelAnimationFrame(this.rafId);
        const startTicker = () => {
          this.rafId = requestAnimationFrame(tick);
        };

        container.addEventListener('mouseenter', stopTicker);
        container.addEventListener('mouseleave', startTicker);
      }
    }
  }

  // Clean up observer and animation frame when component is destroyed
  ngOnDestroy() {
    if (this.observer) {
      this.observer.kill();
    }
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
    const container = this.containerRef?.nativeElement;
    if (container && this.pauseOnHover) {
      container.removeEventListener('mouseenter', () => {});
      container.removeEventListener('mouseleave', () => {});
    }
  }
}

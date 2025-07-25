import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  AfterViewInit,
  Renderer2,
  HostListener,
} from '@angular/core';

@Component({
  selector: 'app-glare-hover',
  imports: [CommonModule],
  templateUrl: './glare-hover.component.html',
  styleUrls: ['./glare-hover.component.scss'],
  standalone: true,
})
export class GlareHoverComponent implements AfterViewInit {
  @Input() width: string = '500px';
  @Input() height: string = '500px';
  @Input() background: string = '#000';
  @Input() borderRadius: string = '10px';
  @Input() borderColor: string = '#333';
  @Input() glareColor: string = '#ffffff';
  @Input() glareOpacity: number = 0.5;
  @Input() glareAngle: number = -45;
  @Input() glareSize: number = 250;
  @Input() transitionDuration: number = 650;
  @Input() playOnce: boolean = false;

  @ViewChild('overlay', { static: true }) overlayRef!: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    this.setOverlayStyle();
  }

  private setOverlayStyle(): void {
    const rgba = this.hexToRgba(this.glareColor, this.glareOpacity);
    const style = this.overlayRef.nativeElement.style;

    style.position = 'absolute';
    style.inset = '0';
    style.background = `linear-gradient(${this.glareAngle}deg,
      hsla(0,0%,0%,0) 60%,
      ${rgba} 70%,
      hsla(0,0%,0%,0) 100%)`;
    style.backgroundSize = `${this.glareSize}% ${this.glareSize}%, 100% 100%`;
    style.backgroundRepeat = 'no-repeat';
    style.backgroundPosition = '-100% -100%, 0 0';
    style.pointerEvents = 'none';
  }

  private hexToRgba(hex: string, opacity: number): string {
    const cleanHex = hex.replace('#', '');
    let r = 0,
      g = 0,
      b = 0;

    if (cleanHex.length === 3) {
      r = parseInt(cleanHex[0] + cleanHex[0], 16);
      g = parseInt(cleanHex[1] + cleanHex[1], 16);
      b = parseInt(cleanHex[2] + cleanHex[2], 16);
    } else if (cleanHex.length === 6) {
      r = parseInt(cleanHex.substring(0, 2), 16);
      g = parseInt(cleanHex.substring(2, 4), 16);
      b = parseInt(cleanHex.substring(4, 6), 16);
    }

    return `rgba(${r}, ${g}, ${b}, ${opacity})`;
  }

  @HostListener('mouseenter')
  animateIn() {
    const el = this.overlayRef.nativeElement;
    el.style.transition = 'none';
    el.style.backgroundPosition = '-100% -100%, 0 0';
    void el.offsetHeight; // force reflow
    el.style.transition = `${this.transitionDuration}ms ease`;
    el.style.backgroundPosition = '100% 100%, 0 0';
  }

  @HostListener('mouseleave')
  animateOut() {
    const el = this.overlayRef.nativeElement;
    if (this.playOnce) {
      el.style.transition = 'none';
      el.style.backgroundPosition = '-100% -100%, 0 0';
    } else {
      el.style.transition = `${this.transitionDuration}ms ease`;
      el.style.backgroundPosition = '-100% -100%, 0 0';
    }
  }
}

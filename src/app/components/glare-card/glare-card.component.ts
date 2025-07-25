import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  ViewChild,
  ElementRef,
  Renderer2,
} from '@angular/core';

@Component({
  selector: 'app-glare-card',
  imports: [CommonModule],
  templateUrl: './glare-card.component.html',
  styleUrls: ['./glare-card.component.scss'],
})
export class GlareCardComponent {
  @Input() link: string | null = null;
  @Input() image: string | null = null;
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() technologies: string[] = [];


  @Input() width: string = '500px';
  @Input() height: string = '500px';
  @Input() background: string = '#000';
  @Input() borderRadius: string = '10px';
  @Input() borderColor: string = '#333';
  @Input() glareColor: string = '#ffffff';
  @Input() glareOpacity: number = 0.3;
  @Input() glareAngle: number = -30;
  @Input() glareSize: number = 300;
  @Input() transitionDuration: number = 800;
  @Input() playOnce: boolean = false;
  @Input() className: string = '';
  @Input() customStyle: { [key: string]: any } = {};

  @ViewChild('overlay', { static: true }) overlayRef!: ElementRef<HTMLDivElement>;

  constructor(private renderer: Renderer2) { }

  get rgba(): string {
    const hex = this.glareColor.replace('#', '');
    let r = 0, g = 0, b = 0;
    if (/^[\dA-Fa-f]{6}$/.test(hex)) {
      r = parseInt(hex.slice(0, 2), 16);
      g = parseInt(hex.slice(2, 4), 16);
      b = parseInt(hex.slice(4, 6), 16);
    } else if (/^[\dA-Fa-f]{3}$/.test(hex)) {
      r = parseInt(hex[0] + hex[0], 16);
      g = parseInt(hex[1] + hex[1], 16);
      b = parseInt(hex[2] + hex[2], 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${this.glareOpacity})`;
  }

  get overlayStyle(): { [key: string]: any } {
    return {
      position: 'absolute',
      inset: 0,
      zIndex: 50,
      background: `linear-gradient(${this.glareAngle}deg, hsla(0,0%,0%,0) 60%, ${this.rgba} 70%, hsla(0,0%,0%,0) 100%)`,
      backgroundSize: `${this.glareSize}% ${this.glareSize}%, 100% 100%`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '-100% -100%, 0 0',
      pointerEvents: 'none',
    };
  }


  animateIn(): void {
    const el = this.overlayRef.nativeElement;
    this.renderer.setStyle(el, 'transition', 'none');
    this.renderer.setStyle(el, 'background-position', '-100% -100%, 0 0');
    // force reflow
    void el.offsetHeight;
    this.renderer.setStyle(el, 'transition', `${this.transitionDuration}ms ease`);
    this.renderer.setStyle(el, 'background-position', '100% 100%, 0 0');
  }

  animateOut(): void {
    const el = this.overlayRef.nativeElement;
    if (this.playOnce) {
      this.renderer.setStyle(el, 'transition', 'none');
    } else {
      this.renderer.setStyle(el, 'transition', `${this.transitionDuration}ms ease`);
    }
    this.renderer.setStyle(el, 'background-position', '-100% -100%, 0 0');
  }
}

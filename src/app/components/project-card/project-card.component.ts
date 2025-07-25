import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { GlareHoverComponent } from '../glare-hover/glare-hover.component';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule, GlareHoverComponent],
  templateUrl: './project-card.component.html',
})
export class ProjectCardComponent {
  @Input() image: string = '';
  @Input() title: string = '';
  @Input() description: string = '';
  @Input() link: string = '';
  @Input() technologies: string[] = [];

  // glare
  @Input() glareColor: string = '#ffffff';
  @Input() glareOpacity: number = 0.3;
  @Input() glareAngle: number = -45;
  @Input() glareSize: number = 300;
  @Input() transitionDuration: number = 800;
  @Input() playOnce: boolean = false;
}

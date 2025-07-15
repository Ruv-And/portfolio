import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skill-icon',
  templateUrl: './skill-icon.component.html',
  styleUrl: './skill-icon.component.scss',
})
export class SkillIconComponent {
  @Input() link: string = '';
  @Input() imagePath: string = '';
  @Input() altText: string = '';
}

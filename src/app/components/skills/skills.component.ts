import { Component } from '@angular/core';
import { SkillIconComponent } from './skill-icon/skill-icon.component';

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrl: './skills.component.scss',
  imports: [SkillIconComponent],
  standalone: true,
})
export class SkillsComponent {}

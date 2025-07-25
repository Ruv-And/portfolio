import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './components/header/header.component';
import { HeroComponent } from './components/hero/hero.component';
import { AboutComponent } from './components/about/about.component';
import { ExperienceComponent } from './components/experience/experience.component';
import { SkillsComponent } from './components/skills/skills.component';
import { ProjectsComponent } from './components/projects/projects.component';
import { AnimatedProjectsComponent } from './components/animated-projects/animated-projects.component';
import { AnimatedProjectsComponent2 } from './components/animated-projects-2/animated-projects-2.component';
import { GlareCardComponent } from './components/glare-card/glare-card.component';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    HeaderComponent,
    HeroComponent,
    AboutComponent,
    ExperienceComponent,
    SkillsComponent,
    ProjectsComponent,
    AnimatedProjectsComponent,
    AnimatedProjectsComponent2,
    GlareCardComponent,
],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'portfolio';

  projects = [
    {
      title: 'Animated Todo App',
      description:
        'A visually engaging todo app with smooth infinite scrolling.',
      tags: ['Angular', 'GSAP', 'UI'],
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      link: 'https://github.com/example/todo-app',
    },
    {
      title: 'Portfolio Carousel',
      description: 'Showcase your projects in a beautiful, animated carousel.',
      tags: ['Portfolio', 'Carousel', 'Animation'],
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      link: 'https://github.com/example/todo-app',
    },
    {
      title: 'E-commerce Slider',
      description: 'Highlight products with a seamless, interactive slider.',
      tags: ['E-commerce', 'Slider', 'UX'],
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      link: 'https://github.com/example/todo-app',
    },
    {
      title: 'Weather Dashboard',
      description: 'Real-time weather tracking with interactive maps.',
      tags: ['React', 'API', 'Maps'],
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      link: 'https://github.com/example/todo-app',
    },
    {
      title: 'Snake Learner',
      description: 'Learning model that learns how to play snake by itself.',
      tags: ['Python', 'API', 'Maps'],
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      link: 'https://github.com/example/snake',
    },
    {
      title: 'Snipiddy',
      description: 'Get recommendations for menu items by simply uploading a picture and stating your preferences.',
      tags: ['Next', 'API', 'Postgres'],
      image:
        'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=400&q=80',
      link: 'https://github.com/example/snipiddy',
    },
  ];
}

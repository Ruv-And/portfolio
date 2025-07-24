import { Component, ElementRef, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
import { Project } from './project.model';
import { CommonModule } from '@angular/common';


gsap.registerPlugin(Draggable, InertiaPlugin);

@Component({
  selector: 'app-animated-projects-2',
  templateUrl: './animated-projects-2.component.html',
  styleUrl: './animated-projects-2.component.scss',
  imports: [CommonModule],
  standalone: true,
})
export class AnimatedProjectsComponent2 implements OnInit, AfterViewInit {
  @ViewChild('scroller') scrollerRef!: ElementRef;

  projects: Project[] = [
    {
      title: 'Snap & Dine',
      image: 'assets/snap-dine.png',
      description: 'A dietary-friendly restaurant scanner using OCR and RAG.',
      technologies: ['Next.js', 'OpenAI', 'PostgreSQL', 'Tailwind'],
      link: 'https://snapanddine.example.com',
    },
    {
      title: 'MusicMatch',
      image: 'assets/musicmatch.png',
      description: 'A personalized music recommendation system for indie artists.',
      technologies: ['JavaScript', 'Spotify API', 'ML'],
      link: 'https://musicmatch.example.com',
    },
    // Add more projects here
  ];

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    const container = this.scrollerRef.nativeElement;
    const cards = Array.from(container.children) as HTMLElement[];

    const cardWidth = cards[0].offsetWidth + parseFloat(getComputedStyle(cards[0]).marginRight || '0');
    const totalWidth = cardWidth * cards.length;

    gsap.set(cards, {
      x: (_, i) => i * cardWidth,
    });

    const wrapX = gsap.utils.wrap(0, totalWidth);

    gsap.to(cards, {
      x: `+=0.5`,
      modifiers: {
        x: gsap.utils.unitize(wrapX),
      },
      duration: 0.05,
      repeat: -1,
      ease: 'none',
    });

    Draggable.create(container, {
      type: 'x',
      inertia: true,
      onDrag: function () {
        gsap.to(cards, {
          x: `+=${this['deltaX']}`,
          modifiers: {
            x: gsap.utils.unitize(wrapX),
          },
          duration: 0,
        });
      },
      onThrowUpdate: function () {
        gsap.to(cards, {
          x: `+=${this['deltaX']}`,
          modifiers: {
            x: gsap.utils.unitize(wrapX),
          },
          duration: 0,
        });
      },
    });
  }
}

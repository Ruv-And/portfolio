import { Component, OnInit } from '@angular/core';
import { DarkVeilComponent } from '../dark-veil/dark-veil.component';

@Component({
  selector: 'app-hero',
  templateUrl: './hero.component.html',
  styleUrl: './hero.component.scss',
  imports: [DarkVeilComponent],
})
export class HeroComponent implements OnInit {
  ngOnInit() {
    this.setupMouseBackground();
  }

  setupMouseBackground() {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth) * 100;
      const y = (e.clientY / window.innerHeight) * 100;

      document.documentElement.style.setProperty('--mouse-x', `${x}%`);
      document.documentElement.style.setProperty('--mouse-y', `${y}%`);
    });
  }
}

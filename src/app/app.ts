import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  tabs = [
    { label: 'News', path: '/news', icon: '📰' },
    { label: 'Fixtures', path: '/fixtures', icon: '⚽' },
    { label: 'Transfers', path: '/transfers', icon: '🔄' },
    { label: 'Stats', path: '/stats', icon: '📊' }
  ];
}

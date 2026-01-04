import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballData, NewsItem } from '../../services/football-data';

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class News implements OnInit {
  newsItems: NewsItem[] = [];
  loading = true;

  constructor(private footballData: FootballData) {}

  ngOnInit() {
    // Load data from service
    this.footballData.getNews().subscribe({
      next: (news) => {
        this.newsItems = news;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.loading = false;
      }
    });
  }

  getCategoryColor(category: string): string {
    const colors: { [key: string]: string } = {
      'Match Report': '#EF0107',
      'News': '#9C824A',
      'Academy': '#023474',
      'Injury News': '#FFB800',
      'Women\'s Team': '#FF006E',
      'Community': '#00D9FF'
    };
    return colors[category] || '#9C824A';
  }

  formatDate(date: Date): string {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;

    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  }
}

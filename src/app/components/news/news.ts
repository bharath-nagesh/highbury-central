import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  category: string;
  imageUrl: string;
}

@Component({
  selector: 'app-news',
  imports: [CommonModule],
  templateUrl: './news.html',
  styleUrl: './news.scss',
})
export class News implements OnInit {
  newsItems: NewsItem[] = [];
  loading = true;

  ngOnInit() {
    // Simulate API call with timeout
    setTimeout(() => {
      this.newsItems = this.getMockNews();
      this.loading = false;
    }, 800);
  }

  getMockNews(): NewsItem[] {
    return [
      {
        id: 1,
        title: 'Arsenal Extend Unbeaten Run with Dominant Victory',
        excerpt: 'The Gunners showcased their title credentials with a commanding performance at the Emirates Stadium, extending their unbeaten streak to 10 matches.',
        author: 'Charles Watts',
        publishedAt: new Date('2026-01-03'),
        category: 'Match Report',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80'
      },
      {
        id: 2,
        title: 'Arteta Praises Squad Depth After Rotation Success',
        excerpt: 'Manager Mikel Arteta highlighted the importance of squad depth as Arsenal continue to compete on multiple fronts this season.',
        author: 'James Benge',
        publishedAt: new Date('2026-01-02'),
        category: 'News',
        imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80'
      },
      {
        id: 3,
        title: 'Academy Starlet Impresses in Training',
        excerpt: 'Young talent continues to emerge from Hale End as another academy graduate catches the eye of the first-team coaching staff.',
        author: 'Jeorge Bird',
        publishedAt: new Date('2026-01-02'),
        category: 'Academy',
        imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80'
      },
      {
        id: 4,
        title: 'Injury Update: Key Players Return to Training',
        excerpt: 'Positive news on the injury front as several first-team regulars make their return to full training ahead of crucial fixtures.',
        author: 'Arsenal Medical Team',
        publishedAt: new Date('2026-01-01'),
        category: 'Injury News',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80'
      },
      {
        id: 5,
        title: 'Arsenal Women Continue Perfect League Form',
        excerpt: 'The Arsenal Women\'s team maintained their 100% record with another impressive display in the Women\'s Super League.',
        author: 'Tom Garry',
        publishedAt: new Date('2025-12-31'),
        category: 'Women\'s Team',
        imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80'
      },
      {
        id: 6,
        title: 'Emirates Stadium to Host Charity Match',
        excerpt: 'Arsenal FC announces special charity fixture featuring club legends, with proceeds going to local community initiatives.',
        author: 'Arsenal Foundation',
        publishedAt: new Date('2025-12-30'),
        category: 'Community',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80'
      }
    ];
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

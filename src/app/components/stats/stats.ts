import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballData } from '../../services/football-data';

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  matchInfo: any = null;
  arsenalStats: any = null;
  opponentStats: any = null;
  topPerformers: any[] = [];
  loading = true;

  constructor(private footballData: FootballData) {}

  ngOnInit() {
    // Load data from service
    this.footballData.getMatchStats().subscribe({
      next: (stats) => {
        this.matchInfo = stats.matchInfo;
        this.arsenalStats = stats.arsenalStats;
        this.opponentStats = stats.opponentStats;
        this.topPerformers = stats.topPerformers;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading stats:', error);
        this.loading = false;
      }
    });
  }

  getRatingColor(rating: number): string {
    if (rating >= 9.0) return '#00D084';
    if (rating >= 8.0) return '#FFB800';
    if (rating >= 7.0) return '#00D9FF';
    return '#FF3B30';
  }

  getStatComparison(arsenalStat: number, opponentStat: number): 'higher' | 'lower' | 'equal' {
    if (arsenalStat > opponentStat) return 'higher';
    if (arsenalStat < opponentStat) return 'lower';
    return 'equal';
  }
}

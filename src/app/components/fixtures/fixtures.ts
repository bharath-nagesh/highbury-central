import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FootballData, Match } from '../../services/football-data';

@Component({
  selector: 'app-fixtures',
  imports: [CommonModule],
  templateUrl: './fixtures.html',
  styleUrl: './fixtures.scss',
})
export class Fixtures implements OnInit {
  upcomingMatches: Match[] = [];
  liveMatch: Match | null = null;
  previousMatches: Match[] = [];
  loading = true;

  constructor(private footballData: FootballData) {}

  ngOnInit() {
    // Load data from service
    this.footballData.getMatches().subscribe({
      next: (matches) => {
        this.loadMatches(matches);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading matches:', error);
        this.loading = false;
      }
    });
  }

  loadMatches(allMatches: Match[]) {
    this.liveMatch = allMatches.find(m => m.status === 'live') || null;
    this.upcomingMatches = allMatches.filter(m => m.status === 'upcoming');
    this.previousMatches = allMatches.filter(m => m.status === 'completed');
  }

  formatDate(date: Date): string {
    return date.toLocaleDateString('en-GB', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  }

  formatTime(date: Date): string {
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  getMatchResult(match: Match): string {
    if (!match.homeScore && !match.awayScore) return '';

    const isArsenalHome = match.homeTeam === 'Arsenal';
    const arsenalScore = isArsenalHome ? match.homeScore : match.awayScore;
    const opponentScore = isArsenalHome ? match.awayScore : match.homeScore;

    if (arsenalScore! > opponentScore!) return 'W';
    if (arsenalScore! < opponentScore!) return 'L';
    return 'D';
  }

  getResultClass(match: Match): string {
    const result = this.getMatchResult(match);
    return result === 'W' ? 'win' : result === 'L' ? 'loss' : 'draw';
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Match {
  id: number;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  date: Date;
  competition: string;
  venue: string;
  status: 'upcoming' | 'live' | 'completed';
  homeLogo: string;
  awayLogo: string;
}

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

  ngOnInit() {
    setTimeout(() => {
      this.loadMatches();
      this.loading = false;
    }, 800);
  }

  loadMatches() {
    const allMatches = this.getMockMatches();

    this.liveMatch = allMatches.find(m => m.status === 'live') || null;
    this.upcomingMatches = allMatches.filter(m => m.status === 'upcoming');
    this.previousMatches = allMatches.filter(m => m.status === 'completed');
  }

  getMockMatches(): Match[] {
    return [
      {
        id: 1,
        homeTeam: 'Arsenal',
        awayTeam: 'Manchester City',
        homeScore: 2,
        awayScore: 1,
        date: new Date('2026-01-04T15:00:00'),
        competition: 'Premier League',
        venue: 'Emirates Stadium',
        status: 'live',
        homeLogo: '🔴',
        awayLogo: '🔵'
      },
      {
        id: 2,
        homeTeam: 'Liverpool',
        awayTeam: 'Arsenal',
        date: new Date('2026-01-08T20:00:00'),
        competition: 'Premier League',
        venue: 'Anfield',
        status: 'upcoming',
        homeLogo: '🔴',
        awayLogo: '🔴'
      },
      {
        id: 3,
        homeTeam: 'Arsenal',
        awayTeam: 'Chelsea',
        date: new Date('2026-01-12T14:00:00'),
        competition: 'Premier League',
        venue: 'Emirates Stadium',
        status: 'upcoming',
        homeLogo: '🔴',
        awayLogo: '🔵'
      },
      {
        id: 4,
        homeTeam: 'Arsenal',
        awayTeam: 'Newcastle United',
        date: new Date('2026-01-15T19:45:00'),
        competition: 'FA Cup',
        venue: 'Emirates Stadium',
        status: 'upcoming',
        homeLogo: '🔴',
        awayLogo: '⚫'
      },
      {
        id: 5,
        homeTeam: 'Arsenal',
        awayTeam: 'Brighton',
        homeScore: 3,
        awayScore: 1,
        date: new Date('2026-01-01T16:30:00'),
        competition: 'Premier League',
        venue: 'Emirates Stadium',
        status: 'completed',
        homeLogo: '🔴',
        awayLogo: '🔵'
      },
      {
        id: 6,
        homeTeam: 'Tottenham',
        awayTeam: 'Arsenal',
        homeScore: 1,
        awayScore: 2,
        date: new Date('2025-12-28T12:30:00'),
        competition: 'Premier League',
        venue: 'Tottenham Hotspur Stadium',
        status: 'completed',
        homeLogo: '⚪',
        awayLogo: '🔴'
      },
      {
        id: 7,
        homeTeam: 'Arsenal',
        awayTeam: 'Aston Villa',
        homeScore: 2,
        awayScore: 0,
        date: new Date('2025-12-22T15:00:00'),
        competition: 'Premier League',
        venue: 'Emirates Stadium',
        status: 'completed',
        homeLogo: '🔴',
        awayLogo: '🟣'
      },
      {
        id: 8,
        homeTeam: 'Manchester United',
        awayTeam: 'Arsenal',
        homeScore: 0,
        awayScore: 1,
        date: new Date('2025-12-18T20:00:00'),
        competition: 'Premier League',
        venue: 'Old Trafford',
        status: 'completed',
        homeLogo: '🔴',
        awayLogo: '🔴'
      },
      {
        id: 9,
        homeTeam: 'Arsenal',
        awayTeam: 'Everton',
        homeScore: 4,
        awayScore: 1,
        date: new Date('2025-12-14T19:30:00'),
        competition: 'Premier League',
        venue: 'Emirates Stadium',
        status: 'completed',
        homeLogo: '🔴',
        awayLogo: '🔵'
      }
    ];
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

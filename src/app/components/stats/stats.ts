import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface GameStats {
  possession: number;
  shots: number;
  shotsOnTarget: number;
  passes: number;
  passAccuracy: number;
  tackles: number;
  fouls: number;
  corners: number;
  offsides: number;
  yellowCards: number;
  redCards: number;
}

interface PlayerStats {
  name: string;
  number: number;
  position: string;
  goals: number;
  assists: number;
  rating: number;
  imageUrl: string;
}

interface MatchInfo {
  opponent: string;
  result: string;
  date: Date;
  competition: string;
  venue: string;
}

@Component({
  selector: 'app-stats',
  imports: [CommonModule],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  matchInfo: MatchInfo | null = null;
  arsenalStats: GameStats | null = null;
  opponentStats: GameStats | null = null;
  topPerformers: PlayerStats[] = [];
  loading = true;

  ngOnInit() {
    setTimeout(() => {
      this.loadStats();
      this.loading = false;
    }, 800);
  }

  loadStats() {
    this.matchInfo = {
      opponent: 'Manchester City',
      result: '2-1',
      date: new Date('2026-01-04T15:00:00'),
      competition: 'Premier League',
      venue: 'Emirates Stadium'
    };

    this.arsenalStats = {
      possession: 58,
      shots: 18,
      shotsOnTarget: 8,
      passes: 542,
      passAccuracy: 87,
      tackles: 21,
      fouls: 12,
      corners: 7,
      offsides: 3,
      yellowCards: 2,
      redCards: 0
    };

    this.opponentStats = {
      possession: 42,
      shots: 12,
      shotsOnTarget: 5,
      passes: 418,
      passAccuracy: 83,
      tackles: 18,
      fouls: 15,
      corners: 4,
      offsides: 2,
      yellowCards: 3,
      redCards: 0
    };

    this.topPerformers = [
      {
        name: 'Bukayo Saka',
        number: 7,
        position: 'RW',
        goals: 1,
        assists: 1,
        rating: 9.2,
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80'
      },
      {
        name: 'Martin Ødegaard',
        number: 8,
        position: 'CAM',
        goals: 1,
        assists: 0,
        rating: 8.8,
        imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80'
      },
      {
        name: 'William Saliba',
        number: 2,
        position: 'CB',
        goals: 0,
        assists: 0,
        rating: 8.5,
        imageUrl: 'https://images.unsplash.com/photo-1592913665398-c89e6d0a23c5?w=400&q=80'
      },
      {
        name: 'Declan Rice',
        number: 41,
        position: 'CDM',
        goals: 0,
        assists: 1,
        rating: 8.3,
        imageUrl: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80'
      }
    ];
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

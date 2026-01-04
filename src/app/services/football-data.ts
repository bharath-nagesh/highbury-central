import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError, map } from 'rxjs';

export interface Match {
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

export interface NewsItem {
  id: number;
  title: string;
  excerpt: string;
  author: string;
  publishedAt: Date;
  category: string;
  imageUrl: string;
  url?: string;
}

export interface Transfer {
  id: number;
  playerName: string;
  position: string;
  age: number;
  fromClub: string;
  toClub: string;
  fee: string;
  status: 'rumour' | 'in-progress' | 'completed';
  probability: number;
  type: 'incoming' | 'outgoing';
  imageUrl: string;
  date?: Date;
}

export interface MatchStats {
  matchInfo: {
    opponent: string;
    result: string;
    date: Date;
    competition: string;
    venue: string;
  };
  arsenalStats: {
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
  };
  opponentStats: {
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
  };
  topPerformers: Array<{
    name: string;
    number: number;
    position: string;
    goals: number;
    assists: number;
    rating: number;
    imageUrl: string;
  }>;
}

@Injectable({
  providedIn: 'root',
})
export class FootballData {
  // Using Football-Data.org API (free tier)
  private readonly API_BASE = 'https://api.football-data.org/v4';
  private readonly API_KEY = 'YOUR_API_KEY_HERE'; // Users need to get their own key
  private readonly ARSENAL_TEAM_ID = 57; // Arsenal's ID in Football-Data.org

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-Auth-Token': this.API_KEY
    });
  }

  /**
   * Get Arsenal matches (fixtures and results)
   */
  getMatches(): Observable<Match[]> {
    // For demo purposes, return mock data with a note about API integration
    return of(this.getMockMatches());

    // Real API call (uncomment when you have an API key):
    // return this.http.get<any>(`${this.API_BASE}/teams/${this.ARSENAL_TEAM_ID}/matches`, {
    //   headers: this.getHeaders()
    // }).pipe(
    //   map(response => this.transformMatches(response.matches)),
    //   catchError(() => of(this.getMockMatches()))
    // );
  }

  /**
   * Get Arsenal news from various sources
   */
  getNews(): Observable<NewsItem[]> {
    // Using mock data for now - real news APIs often require paid subscriptions
    // or have CORS restrictions
    return of(this.getMockNews());
  }

  /**
   * Get transfer rumors and completed transfers
   */
  getTransfers(): Observable<Transfer[]> {
    // Transfer data typically requires premium APIs
    // Keeping mock data for demonstration
    return of(this.getMockTransfers());
  }

  /**
   * Get latest match statistics
   */
  getMatchStats(): Observable<MatchStats> {
    // Match statistics require detailed match data
    // Using mock data for demonstration
    return of(this.getMockStats());
  }

  // Transform API response to our Match interface
  private transformMatches(apiMatches: any[]): Match[] {
    return apiMatches.map((match, index) => ({
      id: match.id || index,
      homeTeam: match.homeTeam.name,
      awayTeam: match.awayTeam.name,
      homeScore: match.score?.fullTime?.home,
      awayScore: match.score?.fullTime?.away,
      date: new Date(match.utcDate),
      competition: match.competition.name,
      venue: match.venue || 'TBD',
      status: this.getMatchStatus(match.status),
      homeLogo: match.homeTeam.crest || '🔴',
      awayLogo: match.awayTeam.crest || '⚪'
    }));
  }

  private getMatchStatus(apiStatus: string): 'upcoming' | 'live' | 'completed' {
    if (apiStatus === 'IN_PLAY' || apiStatus === 'PAUSED') return 'live';
    if (apiStatus === 'FINISHED' || apiStatus === 'AWARDED') return 'completed';
    return 'upcoming';
  }

  // Mock data methods (fallback when API is not available)
  private getMockMatches(): Match[] {
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

  private getMockNews(): NewsItem[] {
    return [
      {
        id: 1,
        title: 'Arsenal Extend Unbeaten Run with Dominant Victory',
        excerpt: 'The Gunners showcased their title credentials with a commanding performance at the Emirates Stadium, extending their unbeaten streak to 10 matches.',
        author: 'Charles Watts',
        publishedAt: new Date('2026-01-03'),
        category: 'Match Report',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        url: 'https://www.arsenal.com'
      },
      {
        id: 2,
        title: 'Arteta Praises Squad Depth After Rotation Success',
        excerpt: 'Manager Mikel Arteta highlighted the importance of squad depth as Arsenal continue to compete on multiple fronts this season.',
        author: 'James Benge',
        publishedAt: new Date('2026-01-02'),
        category: 'News',
        imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
        url: 'https://www.arsenal.com'
      },
      {
        id: 3,
        title: 'Academy Starlet Impresses in Training',
        excerpt: 'Young talent continues to emerge from Hale End as another academy graduate catches the eye of the first-team coaching staff.',
        author: 'Jeorge Bird',
        publishedAt: new Date('2026-01-02'),
        category: 'Academy',
        imageUrl: 'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&q=80',
        url: 'https://www.arsenal.com'
      },
      {
        id: 4,
        title: 'Injury Update: Key Players Return to Training',
        excerpt: 'Positive news on the injury front as several first-team regulars make their return to full training ahead of crucial fixtures.',
        author: 'Arsenal Medical Team',
        publishedAt: new Date('2026-01-01'),
        category: 'Injury News',
        imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
        url: 'https://www.arsenal.com'
      },
      {
        id: 5,
        title: 'Arsenal Women Continue Perfect League Form',
        excerpt: 'The Arsenal Women\'s team maintained their 100% record with another impressive display in the Women\'s Super League.',
        author: 'Tom Garry',
        publishedAt: new Date('2025-12-31'),
        category: 'Women\'s Team',
        imageUrl: 'https://images.unsplash.com/photo-1560272564-c83b66b1ad12?w=800&q=80',
        url: 'https://www.arsenal.com'
      },
      {
        id: 6,
        title: 'Emirates Stadium to Host Charity Match',
        excerpt: 'Arsenal FC announces special charity fixture featuring club legends, with proceeds going to local community initiatives.',
        author: 'Arsenal Foundation',
        publishedAt: new Date('2025-12-30'),
        category: 'Community',
        imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&q=80',
        url: 'https://www.arsenal.com'
      }
    ];
  }

  private getMockTransfers(): Transfer[] {
    return [
      {
        id: 1,
        playerName: 'Viktor Gyökeres',
        position: 'Striker',
        age: 26,
        fromClub: 'Sporting CP',
        toClub: 'Arsenal',
        fee: '£75M',
        status: 'rumour',
        probability: 65,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80'
      },
      {
        id: 2,
        playerName: 'Douglas Luiz',
        position: 'Midfielder',
        age: 26,
        fromClub: 'Juventus',
        toClub: 'Arsenal',
        fee: '£50M',
        status: 'in-progress',
        probability: 80,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80'
      },
      {
        id: 3,
        playerName: 'Benjamin Sesko',
        position: 'Striker',
        age: 21,
        fromClub: 'RB Leipzig',
        toClub: 'Arsenal',
        fee: '£55M',
        status: 'rumour',
        probability: 55,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1592913665398-c89e6d0a23c5?w=400&q=80'
      },
      {
        id: 4,
        playerName: 'Jeremie Frimpong',
        position: 'Right Back',
        age: 23,
        fromClub: 'Bayer Leverkusen',
        toClub: 'Arsenal',
        fee: '£35M',
        status: 'rumour',
        probability: 45,
        type: 'incoming',
        imageUrl: 'https://images.unsplash.com/photo-1606925797300-0b35e9d1794e?w=400&q=80'
      },
      {
        id: 5,
        playerName: 'Eddie Nketiah',
        position: 'Striker',
        age: 25,
        fromClub: 'Arsenal',
        toClub: 'Crystal Palace',
        fee: '£30M',
        status: 'in-progress',
        probability: 75,
        type: 'outgoing',
        imageUrl: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&q=80'
      },
      {
        id: 6,
        playerName: 'Kieran Tierney',
        position: 'Left Back',
        age: 27,
        fromClub: 'Arsenal',
        toClub: 'Newcastle United',
        fee: '£25M',
        status: 'rumour',
        probability: 60,
        type: 'outgoing',
        imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=400&q=80'
      },
      {
        id: 7,
        playerName: 'Emile Smith Rowe',
        position: 'Midfielder',
        age: 24,
        fromClub: 'Arsenal',
        toClub: 'Fulham',
        fee: '£35M',
        status: 'completed',
        probability: 100,
        type: 'outgoing',
        date: new Date('2025-12-28'),
        imageUrl: 'https://images.unsplash.com/photo-1592913665398-c89e6d0a23c5?w=400&q=80'
      }
    ];
  }

  private getMockStats(): MatchStats {
    return {
      matchInfo: {
        opponent: 'Manchester City',
        result: '2-1',
        date: new Date('2026-01-04T15:00:00'),
        competition: 'Premier League',
        venue: 'Emirates Stadium'
      },
      arsenalStats: {
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
      },
      opponentStats: {
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
      },
      topPerformers: [
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
      ]
    };
  }
}

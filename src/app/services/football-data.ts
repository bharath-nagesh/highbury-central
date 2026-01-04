import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of, catchError, map, tap, switchMap } from 'rxjs';
import { environment } from '../../environments/environment.development';

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
  // Cache for API responses
  private matchesCache: { data: Match[], timestamp: number } | null = null;
  private newsCache: { data: NewsItem[], timestamp: number } | null = null;
  private statsCache: { data: MatchStats, timestamp: number } | null = null;
  private transfersCache: { data: Transfer[], timestamp: number } | null = null;

  constructor(private http: HttpClient) {}

  /**
   * Get API-Football headers for RapidAPI
   */
  private getApiFootballHeaders(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': environment.apiFootball.apiKey,
      'X-RapidAPI-Host': environment.apiFootball.apiHost
    });
  }

  /**
   * Get Arsenal matches (fixtures and results) from API-Football
   */
  getMatches(): Observable<Match[]> {
    // Check cache first
    if (this.matchesCache && (Date.now() - this.matchesCache.timestamp) < environment.cache.matchesDuration) {
      console.log('📦 Using cached matches data');
      return of(this.matchesCache.data);
    }

    console.log('🌐 Fetching live matches from API-Football...');

    // Fetch last 10 and next 10 Arsenal matches
    return this.http.get<any>(`${environment.apiFootball.baseUrl}/fixtures`, {
      headers: this.getApiFootballHeaders(),
      params: {
        team: environment.apiFootball.arsenalTeamId.toString(),
        last: '10'
      }
    }).pipe(
      switchMap(lastMatchesResponse => {
        // Fetch next matches
        return this.http.get<any>(`${environment.apiFootball.baseUrl}/fixtures`, {
          headers: this.getApiFootballHeaders(),
          params: {
            team: environment.apiFootball.arsenalTeamId.toString(),
            next: '10'
          }
        }).pipe(
          map(nextMatchesResponse => {
            console.log('✅ API-Football matches received');
            const allMatches = [
              ...(lastMatchesResponse.response || []),
              ...(nextMatchesResponse.response || [])
            ];
            return this.transformApiFootballMatches(allMatches);
          })
        );
      }),
      tap(matches => {
        // Cache the results
        this.matchesCache = { data: matches, timestamp: Date.now() };
        console.log('💾 Matches cached');
      }),
      catchError(error => {
        console.error('❌ API-Football error, using fallback data:', error);
        console.error('Error details:', error.message);
        return of(this.getMockMatches());
      })
    );
  }

  /**
   * Get Arsenal news from NewsAPI
   */
  getNews(): Observable<NewsItem[]> {
    // Check cache first
    if (this.newsCache && (Date.now() - this.newsCache.timestamp) < environment.cache.newsDuration) {
      console.log('📦 Using cached news data');
      return of(this.newsCache.data);
    }

    console.log('🌐 Fetching live news from NewsAPI...');

    // Fetch news from last 7 days
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    return this.http.get<any>(`${environment.newsApi.baseUrl}/everything`, {
      params: {
        q: 'Arsenal FC',
        apiKey: environment.newsApi.apiKey,
        language: 'en',
        sortBy: 'publishedAt',
        from: oneWeekAgo.toISOString().split('T')[0],
        pageSize: '20'
      }
    }).pipe(
      map(response => {
        console.log('✅ NewsAPI response received');
        return this.transformNewsApiArticles(response.articles || []);
      }),
      tap(news => {
        // Cache the results
        this.newsCache = { data: news, timestamp: Date.now() };
        console.log('💾 News cached');
      }),
      catchError(error => {
        console.error('❌ NewsAPI error, using fallback data:', error);
        console.error('Error details:', error.message);
        return of(this.getMockNews());
      })
    );
  }

  /**
   * Get transfer rumors and completed transfers
   * Note: Real-time transfer data requires premium APIs
   */
  getTransfers(): Observable<Transfer[]> {
    // Check cache first
    if (this.transfersCache && (Date.now() - this.transfersCache.timestamp) < environment.cache.transfersDuration) {
      console.log('📦 Using cached transfers data');
      return of(this.transfersCache.data);
    }

    console.log('ℹ️ Transfers: Using curated data (real-time transfer data requires premium API)');

    // Using curated data as real-time transfer APIs are expensive
    const transfers = this.getMockTransfers();
    this.transfersCache = { data: transfers, timestamp: Date.now() };
    return of(transfers);
  }

  /**
   * Get latest match statistics from API-Football
   */
  getMatchStats(): Observable<MatchStats> {
    // Check cache first
    if (this.statsCache && (Date.now() - this.statsCache.timestamp) < environment.cache.statsDuration) {
      console.log('📦 Using cached stats data');
      return of(this.statsCache.data);
    }

    console.log('🌐 Fetching live match stats from API-Football...');

    // Get the most recent Arsenal match
    return this.http.get<any>(`${environment.apiFootball.baseUrl}/fixtures`, {
      headers: this.getApiFootballHeaders(),
      params: {
        team: environment.apiFootball.arsenalTeamId.toString(),
        last: '1'
      }
    }).pipe(
      switchMap(response => {
        if (response.response && response.response.length > 0) {
          const match = response.response[0];
          console.log('✅ Latest match found:', match.teams.home.name, 'vs', match.teams.away.name);

          // Fetch detailed statistics for this match
          return this.http.get<any>(`${environment.apiFootball.baseUrl}/fixtures/statistics`, {
            headers: this.getApiFootballHeaders(),
            params: {
              fixture: match.fixture.id.toString()
            }
          }).pipe(
            map(statsResponse => {
              console.log('✅ Match statistics received');
              return this.transformApiFootballStats(statsResponse.response, match);
            })
          );
        }
        throw new Error('No recent matches found');
      }),
      tap(stats => {
        // Cache the results
        this.statsCache = { data: stats, timestamp: Date.now() };
        console.log('💾 Stats cached');
      }),
      catchError(error => {
        console.error('❌ API-Football stats error, using fallback data:', error);
        console.error('Error details:', error.message);
        return of(this.getMockStats());
      })
    );
  }

  /**
   * Transform API-Football matches to our Match interface
   */
  private transformApiFootballMatches(apiMatches: any[]): Match[] {
    return apiMatches.map((match) => {
      // Determine match status
      let status: 'upcoming' | 'live' | 'completed' = 'upcoming';
      const statusShort = match.fixture.status.short;

      if (statusShort === 'FT' || statusShort === 'AET' || statusShort === 'PEN') {
        status = 'completed';
      } else if (statusShort === '1H' || statusShort === 'HT' || statusShort === '2H' ||
                 statusShort === 'ET' || statusShort === 'P' || statusShort === 'LIVE') {
        status = 'live';
      }

      return {
        id: match.fixture.id,
        homeTeam: match.teams.home.name,
        awayTeam: match.teams.away.name,
        homeScore: match.goals.home,
        awayScore: match.goals.away,
        date: new Date(match.fixture.date),
        competition: match.league.name,
        venue: match.fixture.venue?.name || 'TBD',
        status: status,
        homeLogo: match.teams.home.logo,
        awayLogo: match.teams.away.logo
      };
    });
  }

  /**
   * Transform NewsAPI articles to our NewsItem interface
   */
  private transformNewsApiArticles(articles: any[]): NewsItem[] {
    return articles
      .filter(article => article.title && article.title !== '[Removed]')
      .slice(0, 10)
      .map((article, index) => ({
        id: index + 1,
        title: article.title,
        excerpt: article.description || article.content?.substring(0, 200) || 'No description available',
        author: article.author || article.source?.name || 'Unknown',
        publishedAt: new Date(article.publishedAt),
        category: this.categorizeNews(article.title + ' ' + (article.description || '')),
        imageUrl: article.urlToImage || 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        url: article.url
      }));
  }

  /**
   * Categorize news based on content
   */
  private categorizeNews(content: string): string {
    const lowerContent = content.toLowerCase();
    if (lowerContent.includes('match') || lowerContent.includes(' vs ') || lowerContent.includes('score')) return 'Match Report';
    if (lowerContent.includes('transfer') || lowerContent.includes('sign')) return 'Transfer News';
    if (lowerContent.includes('injury') || lowerContent.includes('injured')) return 'Injury News';
    if (lowerContent.includes('academy') || lowerContent.includes('youth')) return 'Academy';
    if (lowerContent.includes('women')) return 'Women\'s Team';
    return 'News';
  }

  /**
   * Transform API-Football statistics to our MatchStats interface
   */
  private transformApiFootballStats(statsResponse: any[], matchData: any): MatchStats {
    if (!statsResponse || statsResponse.length < 2) {
      return this.getMockStats();
    }

    const arsenalStats = statsResponse.find(s => s.team.id === environment.apiFootball.arsenalTeamId);
    const opponentStats = statsResponse.find(s => s.team.id !== environment.apiFootball.arsenalTeamId);

    if (!arsenalStats || !opponentStats) {
      return this.getMockStats();
    }

    const getStatValue = (stats: any[], type: string): number => {
      const stat = stats.find((s: any) => s.type === type);
      if (!stat || stat.value === null) return 0;

      // Handle percentage values
      if (typeof stat.value === 'string' && stat.value.includes('%')) {
        return parseInt(stat.value);
      }
      return Number(stat.value) || 0;
    };

    return {
      matchInfo: {
        opponent: opponentStats.team.name,
        result: `${matchData.goals.home}-${matchData.goals.away}`,
        date: new Date(matchData.fixture.date),
        competition: matchData.league.name,
        venue: matchData.fixture.venue?.name || 'Unknown'
      },
      arsenalStats: {
        possession: getStatValue(arsenalStats.statistics, 'Ball Possession'),
        shots: getStatValue(arsenalStats.statistics, 'Total Shots'),
        shotsOnTarget: getStatValue(arsenalStats.statistics, 'Shots on Goal'),
        passes: getStatValue(arsenalStats.statistics, 'Total passes'),
        passAccuracy: getStatValue(arsenalStats.statistics, 'Passes %'),
        tackles: getStatValue(arsenalStats.statistics, 'Total Tackles'),
        fouls: getStatValue(arsenalStats.statistics, 'Fouls'),
        corners: getStatValue(arsenalStats.statistics, 'Corner Kicks'),
        offsides: getStatValue(arsenalStats.statistics, 'Offsides'),
        yellowCards: getStatValue(arsenalStats.statistics, 'Yellow Cards'),
        redCards: getStatValue(arsenalStats.statistics, 'Red Cards')
      },
      opponentStats: {
        possession: getStatValue(opponentStats.statistics, 'Ball Possession'),
        shots: getStatValue(opponentStats.statistics, 'Total Shots'),
        shotsOnTarget: getStatValue(opponentStats.statistics, 'Shots on Goal'),
        passes: getStatValue(opponentStats.statistics, 'Total passes'),
        passAccuracy: getStatValue(opponentStats.statistics, 'Passes %'),
        tackles: getStatValue(opponentStats.statistics, 'Total Tackles'),
        fouls: getStatValue(opponentStats.statistics, 'Fouls'),
        corners: getStatValue(opponentStats.statistics, 'Corner Kicks'),
        offsides: getStatValue(opponentStats.statistics, 'Offsides'),
        yellowCards: getStatValue(opponentStats.statistics, 'Yellow Cards'),
        redCards: getStatValue(opponentStats.statistics, 'Red Cards')
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
        }
      ]
    };
  }

  // ========== FALLBACK MOCK DATA ==========
  // These methods provide fallback data when APIs are unavailable or not configured

  private getMockMatches(): Match[] {
    console.warn('⚠️ Using mock matches data. Configure API keys in src/environments/environment.development.ts for real-time data.');
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
        date: new Date('2026-01-11T17:30:00'),
        competition: 'Premier League',
        venue: 'Anfield',
        status: 'upcoming',
        homeLogo: '🔴',
        awayLogo: '🔴'
      },
      {
        id: 3,
        homeTeam: 'Arsenal',
        awayTeam: 'Wolverhampton',
        date: new Date('2026-01-18T15:00:00'),
        competition: 'Premier League',
        venue: 'Emirates Stadium',
        status: 'upcoming',
        homeLogo: '🔴',
        awayLogo: '🟠'
      },
      {
        id: 6,
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
        id: 7,
        homeTeam: 'Tottenham',
        awayTeam: 'Arsenal',
        homeScore: 1,
        awayScore: 3,
        date: new Date('2025-12-29T12:30:00'),
        competition: 'Premier League',
        venue: 'Tottenham Hotspur Stadium',
        status: 'completed',
        homeLogo: '⚪',
        awayLogo: '🔴'
      }
    ];
  }

  private getMockNews(): NewsItem[] {
    console.warn('⚠️ Using mock news data. Configure API keys in src/environments/environment.development.ts for real-time data.');
    return [
      {
        id: 1,
        title: 'Arsenal Extend Unbeaten Run with Dominant Victory',
        excerpt: 'The Gunners showcased their title credentials with a commanding performance at the Emirates Stadium.',
        author: 'Arsenal FC',
        publishedAt: new Date('2026-01-03'),
        category: 'Match Report',
        imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&q=80',
        url: 'https://www.arsenal.com'
      },
      {
        id: 2,
        title: 'Arteta Praises Squad Depth After Rotation Success',
        excerpt: 'Manager Mikel Arteta highlighted the importance of squad depth as Arsenal continue to compete on multiple fronts.',
        author: 'Arsenal FC',
        publishedAt: new Date('2026-01-02'),
        category: 'News',
        imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&q=80',
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
      }
    ];
  }

  private getMockStats(): MatchStats {
    console.warn('⚠️ Using mock stats data. Configure API keys in src/environments/environment.development.ts for real-time data.');
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
        }
      ]
    };
  }
}

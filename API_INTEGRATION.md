# API Integration Guide

This document explains how the Arsenal FC Tracker integrates with data APIs and how to connect it to real data sources.

## Current Architecture

The application uses a centralized `FootballData` service located at `src/app/services/football-data.ts` that provides data to all components. This service is designed to work with real football APIs but currently returns mock data for demonstration purposes.

## Data Service Structure

### Service Location
```
src/app/services/football-data.ts
```

### Available Methods

1. **getMatches()** - Returns Arsenal fixtures and results
2. **getNews()** - Returns Arsenal news articles
3. **getTransfers()** - Returns transfer rumors and completed transfers
4. **getMatchStats()** - Returns detailed match statistics

## Integrating Real Data Sources

### Option 1: Football-Data.org API (Recommended)

Football-Data.org provides comprehensive football data with a free tier.

#### Setup Steps:

1. **Get an API Key**
   - Visit [https://www.football-data.org](https://www.football-data.org)
   - Create a free account
   - Copy your API key from the dashboard

2. **Update the Service**
   - Open `src/app/services/football-data.ts`
   - Replace `YOUR_API_KEY_HERE` with your actual API key (line 96)
   ```typescript
   private readonly API_KEY = 'your_actual_api_key_here';
   ```

3. **Enable API Calls**
   - In the `getMatches()` method (line 110), uncomment the real API code:
   ```typescript
   getMatches(): Observable<Match[]> {
     // Uncomment this block:
     return this.http.get<any>(`${this.API_BASE}/teams/${this.ARSENAL_TEAM_ID}/matches`, {
       headers: this.getHeaders()
     }).pipe(
       map(response => this.transformMatches(response.matches)),
       catchError(() => of(this.getMockMatches()))
     );
   }
   ```

4. **Free Tier Limitations**
   - 10 requests per minute
   - Limited to specific competitions
   - No real-time updates

#### Available Endpoints:
- Arsenal Fixtures: `/teams/57/matches`
- Premier League Standings: `/competitions/PL/standings`
- Match Details: `/matches/{id}`

### Option 2: API-Football (RapidAPI)

Provides more comprehensive data including live scores and detailed statistics.

#### Setup Steps:

1. **Get API Key**
   - Visit [RapidAPI](https://rapidapi.com/api-sports/api/api-football)
   - Subscribe to a plan (free tier available)
   - Copy your RapidAPI key

2. **Update Service Configuration**
   ```typescript
   private readonly API_BASE = 'https://api-football-v1.p.rapidapi.com/v3';
   private readonly API_HEADERS = new HttpHeaders({
     'X-RapidAPI-Key': 'your_rapidapi_key',
     'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
   });
   ```

3. **Arsenal Team ID**: 42

### Option 3: TheSportsDB (Free)

Free API with basic football data.

#### Setup:

1. **Get API Key** (optional, free tier works without key)
   - Visit [TheSportsDB](https://www.thesportsdb.com/api.php)

2. **Update Service**
   ```typescript
   private readonly API_BASE = 'https://www.thesportsdb.com/api/v1/json';
   ```

3. **Arsenal Team ID**: 133604

## News Integration

### Option 1: NewsAPI

For Arsenal-related news articles.

#### Setup:

1. Get API key from [NewsAPI](https://newsapi.org)
2. Update the `getNews()` method:
```typescript
getNews(): Observable<NewsItem[]> {
  return this.http.get<any>('https://newsapi.org/v2/everything', {
    params: {
      q: 'Arsenal FC',
      apiKey: 'your_news_api_key',
      language: 'en',
      sortBy: 'publishedAt'
    }
  }).pipe(
    map(response => this.transformNewsArticles(response.articles)),
    catchError(() => of(this.getMockNews()))
  );
}
```

### Option 2: RSS Feeds

Arsenal official RSS feeds (free, no API key needed):

- **Official News**: `https://www.arsenal.com/rss.xml`
- Parse RSS in Angular using `xml2js` library

## Transfer Data

Transfer data typically requires premium APIs. Options:

1. **Transfermarkt API** (unofficial, scraping-based)
2. **Keep mock data** for demonstration
3. **Manual updates** for major transfers

## Match Statistics

Detailed match statistics require premium APIs:

- **API-Football**: Provides detailed match statistics
- **Opta/Stats Perform**: Professional-grade stats (expensive)
- **Keep mock data** for free alternative

## Environment Variables

For production, store API keys in environment files:

1. **Create environment file**
```typescript
// src/environments/environment.ts
export const environment = {
  production: false,
  footballDataApiKey: 'your_api_key',
  newsApiKey: 'your_news_api_key'
};
```

2. **Update Service**
```typescript
import { environment } from '../../environments/environment';

export class FootballData {
  private readonly API_KEY = environment.footballDataApiKey;
}
```

## CORS Issues

If you encounter CORS errors:

1. **Use a proxy** in development:
   - Create `proxy.conf.json`:
   ```json
   {
     "/api": {
       "target": "https://api.football-data.org/v4",
       "secure": true,
       "changeOrigin": true,
       "pathRewrite": {
         "^/api": ""
       }
     }
   }
   ```

   - Update `angular.json`:
   ```json
   "serve": {
     "options": {
       "proxyConfig": "proxy.conf.json"
     }
   }
   ```

2. **Use a backend** in production:
   - Create a Node.js/Express backend to proxy API requests
   - This also secures your API keys

## Rate Limiting

Implement rate limiting to avoid hitting API limits:

```typescript
import { throttleTime } from 'rxjs/operators';

getMatches(): Observable<Match[]> {
  return this.http.get(...).pipe(
    throttleTime(6000), // Max 10 requests per minute = 6 seconds between requests
    map(...),
    catchError(...)
  );
}
```

## Caching

Implement caching to reduce API calls:

```typescript
private matchesCache: Match[] | null = null;
private cacheTimestamp: number = 0;
private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

getMatches(): Observable<Match[]> {
  const now = Date.now();

  if (this.matchesCache && (now - this.cacheTimestamp) < this.CACHE_DURATION) {
    return of(this.matchesCache);
  }

  return this.http.get(...).pipe(
    tap(matches => {
      this.matchesCache = matches;
      this.cacheTimestamp = now;
    })
  );
}
```

## Testing API Integration

1. **Start development server**: `ng serve`
2. **Check browser console** for API calls and errors
3. **Use browser DevTools Network tab** to inspect API requests
4. **Test with mock data first**, then gradually integrate real APIs

## Error Handling

The service includes fallback to mock data if API calls fail:

```typescript
.pipe(
  catchError((error) => {
    console.error('API error, falling back to mock data:', error);
    return of(this.getMockMatches());
  })
)
```

## Best Practices

1. **Always use environment variables** for API keys
2. **Never commit API keys** to version control
3. **Implement caching** to reduce API calls
4. **Handle rate limits** gracefully
5. **Provide fallback data** for offline functionality
6. **Test thoroughly** before deploying

## Cost Considerations

| API | Free Tier | Paid Plans | Best For |
|-----|-----------|------------|----------|
| Football-Data.org | 10 req/min | From €0/mo | Basic fixtures & results |
| API-Football | 100 req/day | From $0/mo | Comprehensive data |
| NewsAPI | 100 req/day | From $449/mo | News articles |
| TheSportsDB | Unlimited | $3/mo (Patreon) | Basic free data |

## Support

For issues with:
- **Football-Data.org**: [support@football-data.org](mailto:support@football-data.org)
- **API-Football**: RapidAPI support
- **This application**: Create an issue in the repository

## Additional Resources

- [Football-Data.org Documentation](https://www.football-data.org/documentation/quickstart)
- [API-Football Documentation](https://www.api-football.com/documentation-v3)
- [Angular HttpClient Guide](https://angular.dev/guide/http)
- [RxJS Operators](https://rxjs.dev/guide/operators)

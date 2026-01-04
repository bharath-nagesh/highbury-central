// Development environment configuration
// API keys for development - Replace with your own keys from:
// - API-Football: https://dashboard.api-football.com/
// - NewsAPI: https://newsapi.org/

export const environment = {
  production: false,

  // API-Football configuration (via RapidAPI)
  // Get your key from: https://rapidapi.com/api-sports/api/api-football
  apiFootball: {
    baseUrl: 'https://api-football-v1.p.rapidapi.com/v3',
    apiKey: 'YOUR_RAPIDAPI_KEY_HERE',
    apiHost: 'api-football-v1.p.rapidapi.com',
    arsenalTeamId: 42  // Arsenal's team ID in API-Football
  },

  // NewsAPI configuration
  // Get your key from: https://newsapi.org/
  newsApi: {
    baseUrl: 'https://newsapi.org/v2',
    apiKey: 'YOUR_NEWSAPI_KEY_HERE'
  },

  // Cache configuration
  cache: {
    matchesDuration: 60 * 1000,      // 1 minute (for live updates)
    newsDuration: 15 * 60 * 1000,    // 15 minutes
    statsDuration: 60 * 1000,        // 1 minute (for live stats)
    transfersDuration: 60 * 60 * 1000 // 1 hour
  }
};

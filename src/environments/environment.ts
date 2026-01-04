// Production environment configuration
// IMPORTANT: Never commit API keys to version control
// Use environment variables or secure secret management in production

export const environment = {
  production: true,

  // API-Football configuration (via RapidAPI)
  // For production, replace 'YOUR_RAPIDAPI_KEY_HERE' with your actual API key
  apiFootball: {
    baseUrl: 'https://api-football-v1.p.rapidapi.com/v3',
    apiKey: 'YOUR_RAPIDAPI_KEY_HERE',
    apiHost: 'api-football-v1.p.rapidapi.com',
    arsenalTeamId: 42  // Arsenal's team ID in API-Football
  },

  // NewsAPI configuration
  // For production, replace 'YOUR_NEWSAPI_KEY_HERE' with your actual API key
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

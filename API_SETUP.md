# API Setup Guide - Arsenal FC Tracker

This guide will help you set up real-time data APIs for the Arsenal FC Tracker app.

## 🚀 Quick Start

The app now uses **real APIs** instead of mock data! You just need to configure your API keys to start seeing live data.

## Step 1: Get API Keys

### API-Football (for Matches & Statistics)

1. Visit [RapidAPI - API-Football](https://rapidapi.com/api-sports/api/api-football)
2. Click **"Subscribe to Test"**
3. Select the **FREE plan** (100 requests/day)
4. Create an account if you don't have one
5. Copy your **X-RapidAPI-Key** from the dashboard

**What you'll get:**
- ✅ Live match scores (updates every 15 seconds!)
- ✅ Real fixtures and results
- ✅ Detailed match statistics
- ✅ Team logos and venue information

### NewsAPI (for Arsenal News)

1. Visit [NewsAPI.org](https://newsapi.org/register)
2. Create a free account
3. Verify your email
4. Copy your **API Key** from the dashboard

**What you'll get:**
- ✅ Latest Arsenal news from 100+ sources
- ✅ Real article images and descriptions
- ✅ Direct links to full articles

## Step 2: Configure API Keys

1. Open `src/environments/environment.development.ts`
2. Replace the placeholder API keys with your actual keys:

```typescript
export const environment = {
  production: false,

  apiFootball: {
    baseUrl: 'https://api-football-v1.p.rapidapi.com/v3',
    apiKey: 'YOUR_RAPIDAPI_KEY_HERE',  // 👈 Paste your RapidAPI key here
    apiHost: 'api-football-v1.p.rapidapi.com',
    arsenalTeamId: 42
  },

  newsApi: {
    baseUrl: 'https://newsapi.org/v2',
    apiKey: 'YOUR_NEWSAPI_KEY_HERE'  // 👈 Paste your NewsAPI key here
  },

  cache: {
    matchesDuration: 60 * 1000,      // 1 minute
    newsDuration: 15 * 60 * 1000,    // 15 minutes
    statsDuration: 60 * 1000,        // 1 minute
    transfersDuration: 60 * 60 * 1000 // 1 hour
  }
};
```

3. Save the file

## Step 3: Run the App

```bash
# Install dependencies (if you haven't already)
npm install

# Start the development server
ng serve
```

Navigate to `http://localhost:4200/` and you'll see **REAL-TIME DATA**! 🎉

## 🔍 How to Verify It's Working

Open your browser's **Developer Console** (F12) and look for these messages:

- `🌐 Fetching live matches from API-Football...`
- `✅ API-Football matches received`
- `🌐 Fetching live news from NewsAPI...`
- `✅ NewsAPI response received`

If you see `⚠️ Using mock data`, it means the API keys aren't configured correctly.

## 📊 What Data is Real-Time?

| Feature | Data Source | Update Frequency |
|---------|-------------|------------------|
| **Fixtures** | API-Football | Live (1 min cache) |
| **Live Scores** | API-Football | Live (1 min cache) |
| **Match Stats** | API-Football | Live (1 min cache) |
| **News** | NewsAPI | 15 minutes |
| **Transfers** | Curated Data* | Manual updates |

*Real-time transfer data requires premium APIs ($$$), so we use curated transfer rumors instead.

## 💡 Tips & Tricks

### Caching

The app caches API responses to stay within free tier limits:
- Matches: 1 minute (for live updates)
- News: 15 minutes
- Stats: 1 minute
- Transfers: 1 hour

### Rate Limits

**API-Football (FREE):**
- 100 requests per day
- With caching, this supports ~8 hours of active use

**NewsAPI (FREE):**
- 100 requests per day
- Perfect for news that doesn't change as often

### Fallback to Mock Data

If APIs are unavailable or you hit rate limits, the app automatically falls back to mock data so it never breaks!

## 🐛 Troubleshooting

### "CORS Error" in Console

The app is configured with a proxy to handle CORS. Make sure you're running `ng serve` (not just opening index.html).

### "API Error" Messages

Check:
1. API keys are correctly pasted (no extra spaces)
2. You're within your daily rate limits
3. Your internet connection is working

### Still Seeing Mock Data

1. Clear your browser cache
2. Restart the development server (`ng serve`)
3. Check the console for specific error messages

## 🎯 Want More Data?

If you need more requests, both APIs offer affordable paid plans:

- **API-Football**: $10/month for unlimited requests
- **NewsAPI**: $49/month for commercial use

## 🔒 Security Note

**IMPORTANT:** The API keys in `environment.development.ts` are for development only and are NOT committed to Git (they're in `.gitignore`).

For production deployment, use environment variables or a secure secret management service.

## ❓ Questions?

Check out the full [API_INTEGRATION.md](./API_INTEGRATION.md) for advanced configuration options.

---

**Ready to see live Arsenal data? Get your API keys and enjoy! COYG! 🔴⚪**

# Arsenal FC Tracker

A super modern web application built with Angular to track Arsenal FC related content. Features a stunning Apple Liquid Glass inspired design with glassmorphism effects.

## Features

### 1. News Tab 📰
- Latest Arsenal FC news feed
- Beautiful card-based layout with images
- Category badges for different news types
- Author information and publish dates

### 2. Fixtures Tab ⚽
- **Live Match Display**: Real-time score updates with animated indicators
- **Upcoming Fixtures**: View all scheduled matches with date, time, and venue
- **Previous Results**: Scrollable section to review past match results with win/loss/draw indicators
- Color-coded result badges (Green for wins, Yellow for draws, Red for losses)

### 3. Transfers Tab 🔄
- **Incoming Transfers**: Track potential signings with probability indicators
- **Outgoing Transfers**: Monitor players leaving the club
- Player information including age, position, and current club
- Transfer fee and deal status (Rumoured, In Progress, Completed)
- Visual probability bars showing likelihood of transfers

### 4. Stats Tab 📊
- **Match Statistics**: Detailed comparison between Arsenal and opponents
- **Top Performers**: Player ratings with goals and assists
- **Visual Data Representation**: Beautiful progress bars and comparison charts
- Statistics include: possession, shots, passes, tackles, fouls, cards, and more

## Design Features

- **Glassmorphism UI**: Apple Liquid Glass inspired design with backdrop blur effects
- **Arsenal Branding**: Official Arsenal FC colors (Red #EF0107, Gold #9C824A, Navy #023474)
- **Animated Gradients**: Smooth background animations for enhanced visual appeal
- **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices
- **Smooth Transitions**: Fluid animations throughout the application
- **Floating Elements**: Liquid glass effect with subtle floating animations

## Tech Stack

- **Angular 19**: Latest version with standalone components
- **TypeScript**: Type-safe development
- **SCSS**: Advanced styling with mixins and CSS variables
- **Modern CSS**: Backdrop filters, gradients, animations, and glassmorphism
- **RxJS**: Reactive programming for data management
- **HttpClient**: API integration ready

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd highbury-central
```

2. Install dependencies
```bash
npm install
```

### Development Server

To start a local development server:

```bash
ng serve
```

Navigate to `http://localhost:4200/` in your browser. The application will automatically reload when you modify source files.

### Build

To build the project for production:

```bash
ng build
```

Build artifacts will be stored in the `dist/` directory.

## Project Structure

```
src/
├── app/
│   ├── components/
│   │   ├── news/          # News feed component
│   │   ├── fixtures/      # Fixtures and results component
│   │   ├── transfers/     # Transfer tracker component
│   │   └── stats/         # Match statistics component
│   ├── app.ts             # Root component
│   ├── app.routes.ts      # Application routing
│   └── app.scss           # Main component styles
├── styles.scss            # Global styles and design system
└── index.html             # Application entry point
```

## Design System

The application uses a comprehensive design system with:

- **CSS Variables**: Consistent theming with Arsenal brand colors
- **Glass Effect Mixins**: Reusable glassmorphism components
- **Utility Classes**: Pre-built classes for common patterns
- **Animation Library**: Smooth transitions and keyframe animations
- **Responsive Grid System**: Mobile-first responsive layouts

## Data Sources & API Integration

The application is built with a service-based architecture that makes it easy to integrate with real football data APIs.

### Current Implementation

Currently using **mock data** through the `FootballData` service for demonstration purposes. The mock data includes:
- Match fixtures and results
- Arsenal news articles
- Transfer rumors
- Match statistics

### Ready for Real Data

The app is designed to easily integrate with credible football data sources:

- **Football-Data.org** - Free tier available for fixtures and results
- **API-Football (RapidAPI)** - Comprehensive football data
- **TheSportsDB** - Free basic football data
- **NewsAPI** - For Arsenal news articles

### How to Integrate Real APIs

See **[API_INTEGRATION.md](./API_INTEGRATION.md)** for detailed instructions on:
- Setting up API keys
- Integrating with Football-Data.org
- Connecting to other data sources
- Handling CORS and rate limiting
- Best practices for production

**Quick Start with Real Data:**
1. Get a free API key from [Football-Data.org](https://www.football-data.org)
2. Open `src/app/services/football-data.ts`
3. Replace `YOUR_API_KEY_HERE` with your API key
4. Uncomment the real API calls in the service methods

The service includes automatic fallback to mock data if APIs are unavailable, ensuring the app always works.

## Future Enhancements

- Integration with live football data APIs
- User authentication and personalization
- Push notifications for live match updates
- Social sharing features
- Player comparison tools
- Historical statistics and analytics
- Match highlights and video integration

## Development Notes

This project was generated using Angular CLI version 21.0.4.

For more information on Angular CLI commands, visit the [Angular CLI Documentation](https://angular.dev/tools/cli).

## License

This project is for demonstration purposes.

---

Built with ❤️ for Arsenal FC fans worldwide. COYG! 🔴⚪

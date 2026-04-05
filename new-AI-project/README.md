# 🤖 AI News Aggregator

A modern, AI-powered news aggregation platform with advanced sentiment analysis and fake news detection capabilities.

## ✨ Features

### 📰 Core Functionality
- **Multi-source News Aggregation**: Fetches from NewsAPI and RSS feeds
- **Real-time Sentiment Analysis**: AI-powered sentiment detection for all articles
- **Advanced Fake News Detection**: Heuristic-based fake news identification
- **Modern Dashboard**: Clean, responsive UI with real-time analytics

### 🔍 Fake News Detection
- **Single Source Detection**: Identifies articles from single sources
- **Extreme Sentiment Analysis**: Flags overly emotional content
- **Clickbait Detection**: Identifies sensational headlines
- **Sensational Language**: Detects exaggerated language patterns
- **Source Credibility**: Checks against unreliable sources database

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on desktop and mobile
- **Authentication System**: Secure login/signup with JWT
- **Real-time Updates**: Live data refresh and statistics
- **Interactive Charts**: Visual analytics for sentiment and fake news trends
- **Smooth Animations**: Modern transitions and micro-interactions

### 🔐 Authentication System
- **Secure User Management**: JWT-based authentication
- **Password Security**: Bcrypt encryption for user data
- **Session Management**: Persistent login with token storage
- **Demo Account**: Quick access for testing

## 🛠️ Tech Stack

### Backend
- **Node.js**: Runtime environment
- **Express.js**: Web framework
- **MongoDB**: NoSQL database with Mongoose ODM
- **JWT**: Authentication tokens
- **bcryptjs**: Password hashing
- **RSS Parser**: Feed aggregation
- **Sentiment Analysis**: Custom sentiment detection service

### Frontend
- **React 18**: Modern UI framework
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Axios**: HTTP client for API calls
- **React Router**: Client-side routing
- **Chart.js**: Data visualization

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- MongoDB
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ai-news-aggregator.git
   cd ai-news-aggregator
   ```

2. **Install dependencies**
   ```bash
   # Backend
   cd backend
   npm install
   
   # Frontend
   cd ../frontend
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Backend environment
   cd backend
   cp .env.example .env
   # Edit .env with your API keys
   
   # Frontend environment
   cd ../frontend
   cp .env.example .env
   ```

4. **Start the application**
   ```bash
   # Backend (Terminal 1)
   cd backend
   npm run dev
   
   # Frontend (Terminal 2)
   cd frontend
   npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Health Check: http://localhost:5000/health

## 📊 API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/signup` - User registration
- `POST /api/auth/demo` - Demo account access
- `GET /api/auth/me` - Get current user (protected)

### Articles
- `GET /api/articles` - Fetch articles with pagination
- `POST /api/articles/fetch` - Fetch and store latest news
- `GET /api/articles/sentiment/stats` - Sentiment statistics
- `GET /api/articles/fake/stats` - Fake news statistics
- `GET /api/articles/fake` - Filter fake news articles

## 🎯 Demo Account

For quick testing, use the demo credentials:
- **Username**: `demo`
- **Password**: `demo123`

Or use the demo login button for instant access.

## 📈 Features in Detail

### Sentiment Analysis
- **Positive/Negative/Neutral**: Three-way classification
- **Confidence Scoring**: Numerical sentiment scores
- **Trend Analysis**: Track sentiment over time
- **Source Comparison**: Compare sentiment across sources

### Fake News Detection
- **Scoring System**: 0-100 fake news score
- **Multiple Indicators**: Various detection methods
- **Reason Tracking**: Understand why content was flagged
- **Credibility Scoring**: Inverse fake news scores

### Analytics Dashboard
- **Real-time Statistics**: Live data updates
- **Visual Charts**: Progress bars and graphs
- **Filtering Options**: Sort by sentiment, fake score, source
- **Export Data**: Download analytics reports

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-news-aggregator
NEWS_API_KEY=your_newsapi_key_here
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
```

#### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Development

### Project Structure
```
ai-news-aggregator/
├── backend/
│   ├── models/          # MongoDB models
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Express middleware
│   └── config/         # Database configuration
├── frontend/
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── services/    # API services
│   │   ├── types/       # TypeScript types
│   │   └── utils/       # Utility functions
│   └── public/          # Static assets
└── README.md
```

## 🧪 Testing

### Running Tests
```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- **NewsAPI**: For providing news data
- **RSS Parser**: For feed processing
- **Tailwind CSS**: For utility-first CSS
- **React**: For the frontend framework
- **MongoDB**: For the database solution

---

**Built with ❤️ using modern web technologies**
- **Search & Filter**: Search articles by title/content and filter by sentiment

## Tech Stack

### Backend
- **Node.js** + **Express.js** - REST API server
- **MongoDB** + **Mongoose** - Database and ODM
- **Sentiment** - Lightweight sentiment analysis library
- **Axios** - HTTP client for NewsAPI
- **CORS** - Cross-origin resource sharing

### Frontend
- **React** + **TypeScript** - UI framework
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client for API calls

## Project Structure

```
ai-news-aggregator/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── models/
│   │   └── Article.js            # Article model
│   ├── routes/
│   │   └── articles.js           # API routes
│   ├── services/
│   │   ├── newsService.js        # NewsAPI integration
│   │   └── sentimentService.js   # Sentiment analysis
│   ├── .env                      # Environment variables
│   ├── index.js                  # Server entry point
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ArticleCard.tsx   # Article display component
│   │   │   ├── SearchFilter.tsx  # Search and filter component
│   │   │   └── SentimentStats.tsx # Sentiment statistics
│   │   ├── services/
│   │   │   └── api.ts            # API service
│   │   ├── types/
│   │   │   └── index.ts          # TypeScript types
│   │   ├── App.tsx               # Main app component
│   │   └── index.css             # Tailwind CSS imports
│   ├── package.json
│   └── tailwind.config.js
└── README.md
```

## Setup Instructions

### Prerequisites

1. **Node.js** (v14 or higher)
2. **MongoDB** (installed and running)
3. **NewsAPI Key** (free from https://newsapi.org/)

### 1. Clone and Setup

```bash
# Navigate to project directory
cd ai-news-aggregator

# Setup Backend
cd backend
npm install

# Setup Frontend
cd ../frontend
npm install
```

### 2. Environment Configuration

Create a `.env` file in the `backend` directory:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/ai-news-aggregator
NEWS_API_KEY=your_actual_news_api_key_here
```

**Important**: Replace `your_actual_news_api_key_here` with your real NewsAPI key.

### 3. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On Windows (if installed as service)
net start MongoDB

# On macOS/Linux
mongod
```

### 4. Run the Application

#### Backend (Terminal 1):
```bash
cd backend
npm run dev
```

#### Frontend (Terminal 2):
```bash
cd frontend
npm start
```

### 5. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **API Health Check**: http://localhost:5000/health

## API Endpoints

### Articles
- `GET /api/articles` - Get all articles with pagination and filtering
  - Query params: `page`, `limit`, `sentiment`, `search`
- `POST /api/articles` - Fetch and store latest news from NewsAPI
- `GET /api/articles/sentiment/stats` - Get sentiment statistics

### Example API Calls

```bash
# Get all articles
curl http://localhost:5000/api/articles

# Get positive sentiment articles
curl http://localhost:5000/api/articles?sentiment=positive

# Search articles
curl http://localhost:5000/api/articles?search=technology

# Get sentiment stats
curl http://localhost:5000/api/articles/sentiment/stats
```

## How It Works

1. **News Fetching**: The backend fetches articles from NewsAPI when you click "Fetch Latest News"
2. **Sentiment Analysis**: Each article is analyzed using the `sentiment` npm package
3. **Storage**: Articles with sentiment data are stored in MongoDB
4. **Display**: The frontend fetches and displays articles with sentiment badges
5. **Filtering**: Users can search and filter articles by sentiment in real-time

## Future Enhancements

### Planned Features (Not Implemented Yet):

1. **Advanced AI Models**
   - Upgrade to transformer models like DistilBERT for better sentiment analysis
   - Implement named entity recognition and topic modeling

2. **Web Scraping**
   - Add web scraping capabilities using Playwright
   - Support for custom news sources beyond NewsAPI

3. **Microservices Architecture**
   - Split into separate services for news fetching, sentiment analysis, and data storage
   - Implement message queues for better scalability

4. **Enhanced UI/UX**
   - Real-time updates with WebSocket connections
   - Advanced charts and data visualization
   - User preferences and saved searches

5. **Performance & Scalability**
   - Redis caching for frequently accessed data
   - Database optimization and indexing
   - Load balancing for high traffic

## Troubleshooting

### Common Issues:

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check the MONGODB_URI in your .env file

2. **NewsAPI Error**
   - Verify your NewsAPI key is valid
   - Check if you've exceeded API rate limits

3. **CORS Issues**
   - Backend should be running on port 5000
   - Frontend should be running on port 3000

4. **Tailwind CSS Not Working**
   - Ensure you've imported the CSS in index.css
   - Check tailwind.config.js content paths

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the MIT License.

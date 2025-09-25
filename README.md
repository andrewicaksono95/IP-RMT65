<<<<<<< HEAD
# IP-RMT65
=======
# 🍎 FROOTS - AI-Powered Fruit Discovery Platform

A beautiful, modern fullstack application for discovering, exploring, and managing your favorite fruits with AI-powered personalized recommendations. Built with persistent authentication, elegant UI/UX, and comprehensive nutritional insights.

## ✨ Features

### 🔐 **Authentication & Security**
- **Google OAuth2 with PKCE** - Secure authentication flow
- **Persistent Sessions** - Stay logged in after browser refresh
- **JWT Token Validation** - Secure API access with automatic token refresh
- **Smart Auth Guards** - Seamless login validation with cute alerts

### 🍓 **Fruit Discovery**
- **Interactive Fruit Catalog** - Browse 95+ fruits with beautiful SVG icons
- **Advanced Search & Filtering** - Find fruits by name, family, or nutritional content
- **Detailed Fruit Profiles** - Complete nutritional information and botanical data
- **Responsive Grid Layout** - Perfect viewing on all devices

### ❤️ **"My Froots" Favorites System**
- **Personal Fruit Collection** - Save and organize your favorite fruits
- **Custom Notes** - Add personal notes to your favorites
- **Nutritional Dashboard** - Track calories, protein, sugar, and fat intake
- **One-Click Management** - Easy add/remove with confirmation dialogs

### 🤖 **AI-Powered Suggestions**
- **Gemini AI Integration** - Personalized fruit recommendations
- **Smart Recommendations** - Based on your favorite fruits and nutritional preferences
- **Botanical Intelligence** - Suggests fruits from similar families and orders
- **Detailed Explanations** - AI-generated reasons for each recommendation

### 👤 **Profile Management**
- **Beautiful Profile Page** - Elegant design with gradient backgrounds
- **Personal Information** - Manage name, nickname, birth date, and gender
- **Nutritional Summary** - Visual progress bars for your favorite fruits' nutrition
- **Responsive Design** - Consistent experience across all devices

### 🎨 **Modern UI/UX**
- **Cute Alert System** - Beautiful, animated notifications for all actions
- **Bootstrap 5 Styling** - Consistent, professional design system
- **Gradient Backgrounds** - Eye-catching visual appeal
- **Smooth Animations** - Enhanced user experience with transitions
- **Circular Favorite Badges** - Intuitive visual indicators

## 🛠 Tech Stack

### **Backend (API Server)**
- **Node.js + Express** - RESTful API server
- **Sequelize ORM** - PostgreSQL database management
- **Google Auth Library** - OAuth2 authentication with PKCE
- **JWT** - Secure token-based authentication
- **Google Gemini AI** - AI-powered fruit suggestions
- **Zod** - Request/response validation
- **Jest + Supertest** - Comprehensive testing (90%+ coverage)

### **Frontend (React SPA)**
- **Vite + React 18** - Modern build tool and framework
- **Redux Toolkit** - State management with RTK Query
- **React Router v6** - Client-side routing
- **Bootstrap 5** - Responsive UI framework
- **Axios** - HTTP client with interceptors
- **Custom Animations** - Smooth transitions and loading states

### **Database & Assets**
- **PostgreSQL** - Robust relational database
- **Fruityvice API** - Real fruit data with 95+ varieties
- **Custom SVG Icons** - 38 beautiful fruit illustrations
- **Optimized Images** - Efficient asset loading

## 🔧 Environment Variables

### **Backend Configuration (`server/.env`)**
Copy from `server/.env.example` and configure:

```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database URLs
DATABASE_URL=postgresql://username:password@localhost:5432/froots_dev
DATABASE_URL_TEST=postgresql://username:password@localhost:5432/froots_test

# Security
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_strong

# Google OAuth2 (Get from Google Cloud Console)
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:5173/auth/callback

# AI Integration (Optional - Get from Google AI Studio)
GEMINI_API_KEY=your-gemini-api-key

# CORS Configuration
ALLOWED_ORIGIN=http://localhost:5173
```

### **Frontend Configuration (`client/.env`)**
```env
# API Server URL
VITE_API_URL=http://localhost:3000
```

### **Database Setup**
1. Install PostgreSQL
2. Create development and test databases:
   ```sql
   CREATE DATABASE froots_dev;
   CREATE DATABASE froots_test;
   ```

## 🚀 Quick Start

### **Prerequisites**
- Node.js 18+ and npm
- PostgreSQL 12+
- Google Cloud Console project (for OAuth)

### **Installation & Setup**

1. **Clone and Install Dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies  
   cd ../client
   npm install
   ```

2. **Database Setup**
   ```bash
   # Create PostgreSQL databases
   createdb froots_dev
   createdb froots_test
   ```

3. **Environment Configuration**
   ```bash
   # Backend environment
   cd server
   cp .env.example .env
   # Edit .env with your database URLs, JWT secret, and Google OAuth credentials
   
   # Frontend environment
   cd ../client
   echo "VITE_API_URL=http://localhost:3000" > .env
   ```

4. **Seed Database with Fruit Data**
   ```bash
   cd server
   npm run seed:fruits
   ```

5. **Start Development Servers**
   ```bash
   # Terminal 1: Start backend server (port 3000)
   cd server
   npm run dev
   
   # Terminal 2: Start frontend dev server (port 5173)
   cd client  
   npm run dev
   ```

6. **Open Application**
   - Frontend: http://localhost:5173 (Vite development server)
   - Backend API: http://localhost:3000 (Express server)
   - API Documentation: `server/API_DOCS.md`

> **Port Configuration:** Server runs on port 3000 by default (configurable via `PORT` environment variable). Frontend development server uses Vite's default port 5173.

## 🧪 Testing & Quality Assurance

### **Backend Testing**
```bash
cd server

# Run all tests
npm test

# Run tests with coverage report
npm run test:coverage

# Target: 90%+ test coverage across all modules
```

### **Test Coverage Areas**
- ✅ **Authentication** - Google OAuth2, JWT validation, PKCE flow
- ✅ **CRUD Operations** - Fruits, Favorites, Profile management
- ✅ **AI Integration** - Gemini AI suggestions with mocked responses
- ✅ **Validation** - Zod schema validation for all endpoints
- ✅ **Error Handling** - Comprehensive error response testing
- ✅ **Middleware** - Auth guards, CORS, request validation

### **AI Service Testing**
- Google Gemini AI responses are mocked in tests using Jest
- Fallback behavior tested for API failures
- Nutritional similarity algorithms validated

## 📁 Project Architecture

```
froots/
├── 📂 server/                          # Backend API Server
│   ├── 📂 src/
│   │   ├── 📂 config/
│   │   │   └── database.js             # Sequelize configuration
│   │   ├── 📂 models/
│   │   │   ├── User.js                 # User model (Google OAuth)
│   │   │   ├── Fruit.js                # Fruit data model
│   │   │   ├── Favorite.js             # User favorites junction
│   │   │   └── index.js                # Model associations
│   │   ├── 📂 controllers/
│   │   │   ├── authController.js       # Google OAuth + JWT
│   │   │   ├── fruitController.js      # Fruit CRUD operations
│   │   │   ├── favoriteController.js   # Favorites management
│   │   │   ├── profileController.js    # User profile updates
│   │   │   └── aiController.js         # AI suggestions endpoint
│   │   ├── 📂 services/
│   │   │   ├── fruitService.js         # Business logic for fruits
│   │   │   └── aiService.js            # Gemini AI integration
│   │   ├── 📂 middleware/
│   │   │   ├── auth.js                 # JWT verification
│   │   │   ├── errorHandler.js         # Global error handling
│   │   │   └── validate.js             # Zod validation middleware
│   │   ├── 📂 routes/
│   │   │   ├── authRoutes.js           # Authentication endpoints
│   │   │   ├── fruitRoutes.js          # Fruit catalog endpoints
│   │   │   ├── favoriteRoutes.js       # Favorites CRUD endpoints
│   │   │   ├── profileRoutes.js        # Profile management
│   │   │   └── aiRoutes.js             # AI suggestions
│   │   ├── 📂 validation/
│   │   │   └── schemas.js              # Zod validation schemas
│   │   ├── 📂 scripts/
│   │   │   └── seedFruityvice.js       # Database seeding from API
│   │   ├── 📂 utils/
│   │   │   └── createError.js          # Error creation utility
│   │   ├── app.js                      # Express app configuration
│   │   └── server.js                   # Server startup
│   ├── 📂 tests/                       # Jest test suites
│   ├── API_DOCS.md                     # Complete API documentation
│   ├── openapi.yaml                    # OpenAPI specification
│   └── package.json
│
├── 📂 client/                          # Frontend React Application
│   ├── 📂 src/
│   │   ├── 📂 pages/
│   │   │   ├── AppLayout.jsx           # Main app layout with nav
│   │   │   ├── Home.jsx                # Fruit catalog with search
│   │   │   ├── FruitDetail.jsx         # Individual fruit details
│   │   │   ├── MyFroots.jsx            # Favorites + AI suggestions
│   │   │   ├── Profile.jsx             # User profile management
│   │   │   ├── AuthCallback.jsx        # OAuth callback handler
│   │   │   └── GlobalStatus.jsx        # Global app status
│   │   ├── 📂 slices/                  # Redux Toolkit slices
│   │   │   ├── authSlice.js            # Authentication state
│   │   │   ├── fruitSlice.js           # Fruit catalog state
│   │   │   ├── favoriteSlice.js        # Favorites state
│   │   │   ├── profileSlice.js         # Profile state
│   │   │   ├── aiSlice.js              # AI suggestions state
│   │   │   └── uiSlice.js              # UI state management
│   │   ├── 📂 components/              # Reusable React components
│   │   ├── 📂 utils/
│   │   │   └── alerts.js               # Cute alert system
│   │   ├── api.js                      # Axios API client
│   │   ├── store.js                    # Redux store configuration
│   │   └── main.jsx                    # React app entry point
│   ├── 📂 public/
│   │   └── 📂 svg/                     # 38 optimized fruit SVG icons
│   └── package.json
│
├── README.md                           # This comprehensive guide
└── .gitignore                          # Git ignore rules
```

## 🤖 AI Integration Deep Dive

### **Gemini AI-Powered Recommendations**
The application uses Google's Gemini AI to provide intelligent fruit suggestions:

1. **Smart Analysis**
   - Analyzes user's favorite fruits for patterns
   - Identifies botanical families and nutritional preferences
   - Uses cosine similarity for nutritional matching

2. **Recommendation Algorithm**
   ```javascript
   // Botanical similarity (same family/order)
   const candidateFruits = allFruits.filter(fruit => {
     const matchesOrder = favoriteOrders.includes(fruit.order);
     const matchesFamily = favoriteFamilies.includes(fruit.family);
     return isNotFavorite && (matchesOrder || matchesFamily);
   });
   
   // Nutritional similarity using cosine similarity
   const vectors = fruits.map(f => [calories, fat, sugar, carbs, protein]);
   const similarity = cosineSimilarity(userPrefs, fruitVector);
   ```

3. **AI-Generated Explanations**
   - Prompts Gemini with favorite fruits context
   - Generates personalized reasons for each suggestion
   - Handles API failures gracefully with fallback explanations

4. **Features**
   - **Contextual Suggestions** - Based on your actual favorites
   - **Nutritional Highlights** - Key nutritional benefits
   - **Botanical Intelligence** - Similar families and orders
   - **Fallback System** - Works even without AI API key

## 🔐 Authentication Architecture

### **Google OAuth2 with PKCE Flow**
Implements the most secure OAuth2 flow:

1. **Frontend initiates auth** → `GET /auth/google/url`
2. **Server generates PKCE challenge** → Returns Google OAuth URL
3. **User authenticates with Google** → Redirected to callback
4. **Frontend exchanges code** → `POST /auth/google/exchange`
5. **Server validates with Google** → Returns JWT token
6. **Persistent sessions** → Token stored in localStorage
7. **Auto-refresh verification** → `GET /auth/verify` on app load

### **Security Features**
- **PKCE Protection** - Prevents authorization code interception
- **State Parameter** - CSRF protection
- **JWT Tokens** - Stateless authentication
- **Token Verification** - Server-side validation on each request
- **Graceful Logout** - Proper token cleanup

## 📊 Data & Performance

### **Fruit Database**
- **95+ Fruits** - Complete nutritional data from Fruityvice API
- **Botanical Classification** - Family, order, genus information
- **Nutritional Values** - Calories, macronutrients per 100g
- **Visual Assets** - 38 custom SVG illustrations
- **Search Optimization** - Indexed for fast queries

### **Performance Optimizations**
- **Lazy Loading** - Components and data loaded on demand
- **Redux Caching** - Efficient state management
- **Optimized Assets** - Compressed SVG icons
- **Database Indexing** - Fast queries on commonly searched fields
- **Connection Pooling** - Efficient database connections

## 🔧 Development Commands

### **Backend (Server)**
```bash
cd server

# Development with hot reload
npm run dev

# Production start
npm start

# Database seeding
npm run seed:fruits

# Testing
npm test                    # Run all tests
npm run test:coverage       # Coverage report
```

### **Frontend (Client)**
```bash
cd client

# Development server with HMR
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## 🌐 API Documentation

Complete API documentation is available in `server/API_DOCS.md` including:

- **Authentication Endpoints** - Google OAuth2 + JWT
- **Fruit Catalog** - Search, filter, pagination
- **Favorites Management** - CRUD operations
- **Profile Management** - User data updates  
- **AI Suggestions** - Personalized recommendations
- **Request/Response Schemas** - Complete examples
- **Error Handling** - Status codes and formats

## 🚀 Production Deployment

### **Security Checklist**
- ✅ Use strong, unique `JWT_SECRET` (64+ characters)
- ✅ Configure `ALLOWED_ORIGIN` for your production domain
- ✅ Ensure Google OAuth redirect URI matches production URL
- ✅ Set `NODE_ENV=production`
- ✅ Use HTTPS in production
- ✅ Configure database connection pooling
- ✅ Set up proper logging and monitoring

### **Environment Variables for Production**
```env
NODE_ENV=production
DATABASE_URL=your-production-postgresql-url
JWT_SECRET=your-super-secure-jwt-secret-minimum-64-characters
GOOGLE_CLIENT_ID=your-production-google-client-id
GOOGLE_CLIENT_SECRET=your-production-google-client-secret
GOOGLE_REDIRECT_URI=https://yourdomain.com/auth/callback
GEMINI_API_KEY=your-gemini-api-key
ALLOWED_ORIGIN=https://yourdomain.com
PORT=3000
```

## 🎯 Recent Updates & Features

### **Version 1.0.0 - December 2024**
- ✅ **Persistent Authentication** - Stay logged in after refresh
- ✅ **Cute Alert System** - Beautiful animated notifications
- ✅ **Enhanced UX** - Rounded cards, smooth transitions
- ✅ **AI Suggestions** - Gemini AI-powered recommendations
- ✅ **Profile Beautification** - Modern gradient design
- ✅ **"My Froots" Branding** - Updated terminology throughout
- ✅ **Circular Badges** - Improved favorite indicators
- ✅ **Code Optimization** - Removed unused dependencies
- ✅ **Comprehensive Documentation** - Complete API docs

### **Key Improvements**
- **Bootstrap 5 Only** - Removed Tailwind CSS for consistency
- **38 Optimized SVG Icons** - Removed 12 unused assets
- **Enhanced Error Handling** - Better user feedback
- **Responsive Design** - Perfect on all screen sizes
- **Loading States** - Smooth user experience

## 🤝 Contributing

### **Development Workflow**
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes with proper testing
4. Run tests: `npm test` (maintain 90%+ coverage)
5. Commit changes: `git commit -m 'Add amazing feature'`
6. Push to branch: `git push origin feature/amazing-feature`
7. Create a Pull Request

### **Code Standards**
- Follow existing code style and patterns
- Add tests for new features
- Update documentation for API changes
- Use meaningful commit messages
- Ensure all tests pass before PR

## 🆘 Troubleshooting

### **Common Issues**

**Database Connection Errors**
```bash
# Check PostgreSQL is running
pg_ctl status

# Verify database exists
psql -l | grep froots
```

**Google OAuth Issues**
- Verify client ID matches in both Google Console and `.env`
- Check redirect URI matches exactly (including protocol)
- Ensure Google OAuth consent screen is configured

**Frontend Build Issues**
```bash
# Clear Vite cache
rm -rf node_modules/.vite
npm run dev
```

**API Not Responding**
- Check server is running on port 3000
- Verify CORS configuration
- Check network connectivity

## 📞 Support

For issues and questions:
- Check the API documentation in `server/API_DOCS.md`
- Review test files for usage examples
- Check existing issues and create new ones if needed

## 📄 License

This project is part of a coding bootcamp assignment and is for educational purposes.

---

**Built with ❤️ using modern web technologies**  
**Last Updated:** December 2024  
**Version:** 1.0.0

>>>>>>> origin/development

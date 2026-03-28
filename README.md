# FilmVerse - Movie Review & Recommendation Website

A modern web application for discovering and reviewing Malayalam and Tamil movies.

## 📁 Project Structure

```
movie-review-website/
├── frontend/
│   ├── index.html      # Main HTML file
│   ├── script.js       # Frontend logic & API calls
│   └── style.css       # Styling
│
├── backend/
│   ├── mock-server.js  # Development server (no database needed)
│   ├── server.js       # Production server (requires PostgreSQL)
│   ├── db.js           # Database connection
│   ├── package.json    # Node dependencies
│   └── .env            # Environment variables (not tracked in git)
│
└── .gitignore          # Git ignore file
```

## 🚀 Getting Started

### Production Setup (With Database)

1. **Install dependencies:**
   ```bash
   cd backend
   npm install
   ```

2. **Configure environment:**
   - Create `.env` file in backend folder with:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/movie_review
   PORT=5000
   ```

3. **Setup PostgreSQL database:**
   - Create a database named `movie_review`
   - Run the schema from `backend/schema.db`

4. **Start server:**
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000` or deployed to Render

5. **Open frontend:**
   - Open `frontend/index.html` in your browser
   - Movie data will load from your backend

## 📋 Features

- ✅ View featured movies
- ✅ Browse recommended movies
- ✅ Search movies by title/genre
- ✅ Submit reviews with ratings
- ✅ Responsive design with glass-morphism effects
- ✅ Fallback mock data if API fails

## 🛠️ Tech Stack

- **Frontend:** HTML, CSS, JavaScript (Vanilla)
- **Backend:** Node.js, Express
- **Database:** PostgreSQL (optional)
- **UI:** Glass-morphism design with gradient effects

## 📝 Files to Upload to Git

Essential files (tracked in git):
- ✅ `frontend/` - All frontend files
- ✅ `backend/server.js` - Production backend
- ✅ `backend/db.js` - Database config
- ✅ `backend/package.json` - Dependencies
- ✅ `backend/schema.db` - Database schema
- ✅ `README.md` - This file
- ✅ `.gitignore` - Git ignore rules

Files NOT tracked (in .gitignore):
- ❌ `node_modules/` - Dependencies (reinstall via npm install)
- ❌ `package-lock.json` - Auto-generated
- ❌ `.env` - Environment variables (security)
- ❌ `*.db` - Database files

## 🎨 Customization

- Modify dropdown color in `frontend/style.css` (`.form-control` class)
- Update API URL in `frontend/script.js` line 1-3
- Modify backend port in `backend/server.js` or `.env` file

## 🐛 Troubleshooting

**Images not loading?**
- Check internet connection (uses Unsplash CDN)
- Clear browser cache

**Dropdown not visible?**
- Check `frontend/style.css` `.form-control` styling
- Ensure CSS file is loaded

**Backend connection failed?**
- Verify Render backend is running (https://project-y7dn.onrender.com)
- Check browser console for network errors
- Verify DATABASE_URL is set in Render environment variables

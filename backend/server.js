const express = require('express');
const cors = require('cors');
const pool = require('./db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* -------------------------
   TEST ROUTE
------------------------- */
app.get('/', (req, res) => {
  res.send('Movie Review Backend Running 🎬');
});

/* -------------------------
   HEALTH CHECK
------------------------- */
app.get('/health', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()');
    res.json({ 
      status: 'ok',
      database: 'connected',
      timestamp: result.rows[0]
    });
  } catch (err) {
    res.status(500).json({ 
      status: 'error',
      database: 'disconnected',
      error: err.message
    });
  }
});

/* -------------------------
   INITIALIZE DATABASE
------------------------- */
app.post('/api/init-db', async (req, res) => {
  try {
    console.log('Initializing database schema...');
    
    // Drop existing tables
    await pool.query('DROP TABLE IF EXISTS reviews');
    await pool.query('DROP TABLE IF EXISTS movies');
    
    // Create movies table
    await pool.query(`
      CREATE TABLE movies (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        genre VARCHAR(100) NOT NULL,
        year INT NOT NULL,
        poster TEXT NOT NULL,
        description TEXT NOT NULL,
        recommended BOOLEAN DEFAULT false
      )
    `);
    
    // Create reviews table
    await pool.query(`
      CREATE TABLE reviews (
        id SERIAL PRIMARY KEY,
        movie_id INT REFERENCES movies(id) ON DELETE CASCADE,
        username VARCHAR(100) NOT NULL,
        rating INT CHECK (rating >= 1 AND rating <= 5),
        review_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Insert movie data
    const movies = [
      ['2018', 'Malayalam • Drama', 2023, 'https://images.unsplash.com/photo-1594909122845-11bda064b412?w=400&h=600&fit=crop', 'A survival drama based on the devastating Kerala floods and the resilience of ordinary people.', true],
      ['Premam', 'Malayalam • Romance', 2015, 'https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=400&h=600&fit=crop', 'A coming-of-age romantic drama that follows different stages of love in George\'s life.', true],
      ['Bramayugam', 'Malayalam • Horror', 2024, 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400&h=600&fit=crop', 'A dark black-and-white horror thriller set in an eerie ancient mansion.', true],
      ['Manjummel Boys', 'Malayalam • Adventure', 2024, 'https://images.unsplash.com/photo-1511379938547-c1f69b13d835?w=400&h=600&fit=crop', 'A gripping survival thriller based on a true friendship and rescue incident.', true],
      ['Lucifer', 'Malayalam • Action', 2019, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=400&h=600&fit=crop', 'A political action thriller revolving around power, mystery, and leadership.', false],
      ['Vikram', 'Tamil • Action', 2022, 'https://images.unsplash.com/photo-1533613220915-121e63e41e2d?w=400&h=600&fit=crop', 'An intense action thriller featuring secret agents, gang wars, and explosive revenge.', true],
      ['Leo', 'Tamil • Action', 2023, 'https://images.unsplash.com/photo-1486826325049-e0e0d8f1dc3c?w=400&h=600&fit=crop', 'A stylish action thriller about a man whose past returns to haunt him.', true],
      ['96', 'Tamil • Romance', 2018, 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop', 'A nostalgic romantic drama about two former lovers reuniting after years.', true],
      ['Jigarthanda DoubleX', 'Tamil • Crime', 2023, 'https://images.unsplash.com/photo-1519669335166-040eac643f43?w=400&h=600&fit=crop', 'A bold crime drama blending cinema, politics, and rebellion.', false],
      ['Kaithi', 'Tamil • Thriller', 2019, 'https://images.unsplash.com/photo-1551817601-beec7fbf91d5?w=400&h=600&fit=crop', 'A high-octane thriller that unfolds over a single dangerous night.', true]
    ];
    
    for (const movie of movies) {
      await pool.query(
        'INSERT INTO movies (title, genre, year, poster, description, recommended) VALUES ($1, $2, $3, $4, $5, $6)',
        movie
      );
    }
    
    console.log('Database initialized successfully!');
    res.json({ 
      status: 'success',
      message: 'Database and tables created successfully',
      moviesInserted: movies.length
    });
  } catch (err) {
    console.error('Database initialization error:', err.message);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to initialize database',
      error: err.message
    });
  }
});

/* -------------------------
   GET ALL MOVIES
------------------------- */
app.get('/api/movies', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM movies ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch movies' });
  }
});

/* -------------------------
   GET SINGLE MOVIE WITH REVIEWS
------------------------- */
app.get('/api/movies/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const movieResult = await pool.query('SELECT * FROM movies WHERE id = $1', [id]);
    const reviewResult = await pool.query(
      'SELECT * FROM reviews WHERE movie_id = $1 ORDER BY created_at DESC',
      [id]
    );

    if (movieResult.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json({
      movie: movieResult.rows[0],
      reviews: reviewResult.rows
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch movie details' });
  }
});

/* -------------------------
   ADD REVIEW
------------------------- */
app.post('/api/reviews', async (req, res) => {
  const { movie_id, username, rating, review_text } = req.body;

  if (!movie_id || !username || !rating || !review_text) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    console.log('Adding review:', { movie_id, username, rating });
    const result = await pool.query(
      `INSERT INTO reviews (movie_id, username, rating, review_text)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [movie_id, username, rating, review_text]
    );

    console.log('Review added successfully');
    res.status(201).json({
      message: 'Review added successfully',
      review: result.rows[0]
    });
  } catch (err) {
    console.error('Error adding review:', err.message);
    res.status(500).json({ error: 'Failed to add review: ' + err.message });
  }
});

/* -------------------------
   GET RECOMMENDED MOVIES
------------------------- */
app.get('/api/recommended', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM movies
       WHERE recommended = true
       ORDER BY id ASC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
});

/* -------------------------
   SEARCH MOVIES
------------------------- */
app.get('/api/search', async (req, res) => {
  const { q } = req.query;

  try {
    const result = await pool.query(
      `SELECT * FROM movies
       WHERE title ILIKE $1 OR genre ILIKE $1
       ORDER BY id ASC`,
      [`%${q}%`]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
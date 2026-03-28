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
    const result = await pool.query(
      `INSERT INTO reviews (movie_id, username, rating, review_text)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [movie_id, username, rating, review_text]
    );

    res.status(201).json({
      message: 'Review added successfully',
      review: result.rows[0]
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Failed to add review' });
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
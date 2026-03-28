// Production backend URL
const API_URL = "https://project-y7dn.onrender.com";
// For local development, change to:
// const API_URL = "http://localhost:5000";

const moviesContainer = document.getElementById("moviesContainer");
const recommendedContainer = document.getElementById("recommendedContainer");
const movieSelect = document.getElementById("movieSelect");
const reviewForm = document.getElementById("reviewForm");
const reviewMessage = document.getElementById("reviewMessage");
const searchInput = document.getElementById("searchInput");

// Fallback mock data with images
const FALLBACK_MOVIES = [
  {
    id: 1,
    title: "2018",
    genre: "Malayalam • Drama",
    year: 2023,
    poster: "https://m.media-amazon.com/images/M/MV5BMTgzNTc5YjAtMWY2Ny00MzYwLWI4NzAtYTRkZjAwMjcwNDMxXkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "A survival drama based on the devastating Kerala floods and the resilience of ordinary people.",
    recommended: true
  },
  {
    id: 2,
    title: "Premam",
    genre: "Malayalam • Romance",
    year: 2015,
    poster: "https://m.media-amazon.com/images/M/MV5BOTU3NDcxMDAtODhhMS00NDYxLWE4MGUtNDBlNjZiMzgwYjhhXkEyXkFqcGdeQXVyNzI1NzMxNzM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "A coming-of-age romantic drama that follows different stages of love in George's life.",
    recommended: true
  },
  {
    id: 3,
    title: "Bramayugam",
    genre: "Malayalam • Horror",
    year: 2024,
    poster: "https://m.media-amazon.com/images/M/MV5BMjE4MjE0OTktMzJlNS00MDI1LWJjMDItODAzOGIyNzQ2NTI5XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "A dark black-and-white horror thriller set in an eerie ancient mansion.",
    recommended: true
  },
  {
    id: 4,
    title: "Manjummel Boys",
    genre: "Malayalam • Adventure",
    year: 2024,
    poster: "https://m.media-amazon.com/images/M/MV5BMjJiYjYxNGMtZDczMS00ZGZjLWI3MDctODcwMDc1M2ZjZGM4XkEyXkFqcGdeQXVyMTUzNTg3NjUx._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "A gripping survival thriller based on a true friendship and rescue incident.",
    recommended: true
  },
  {
    id: 6,
    title: "Vikram",
    genre: "Tamil • Action",
    year: 2022,
    poster: "https://m.media-amazon.com/images/M/MV5BZTJkZTI0MzItYmM2Ni00NGM2LTliZTgtNDI2ZGI4ZGVhODFlXkEyXkFqcGdeQXVyMTEzNzg0Ng@@._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "An intense action thriller featuring secret agents, gang wars, and explosive revenge.",
    recommended: true
  },
  {
    id: 7,
    title: "Leo",
    genre: "Tamil • Action",
    year: 2023,
    poster: "https://m.media-amazon.com/images/M/MV5BYWUwYzdlZjUtMDcyMS00YjI0LThlMzUtNWM4ZWZkZjQ5OTY1XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "A stylish action thriller about a man whose past returns to haunt him.",
    recommended: true
  },
  {
    id: 8,
    title: "96",
    genre: "Tamil • Romance",
    year: 2018,
    poster: "https://m.media-amazon.com/images/M/MV5BMTQwOTU5MTc5Nl5BMl5BanBnXkFtZTgwNzA4Njc3NDM@._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "A nostalgic romantic drama about two former lovers reuniting after years.",
    recommended: true
  },
  {
    id: 10,
    title: "Kaithi",
    genre: "Tamil • Thriller",
    year: 2019,
    poster: "https://m.media-amazon.com/images/M/MV5BNGM0YjMyOWQtMjJmOS00MjA1LTkwMWUtOGQzNGI3OTYxYzY4XkEyXkFqcGdeQXVyMjkxNzQ1NDI@._V1_UX182_CR0,0,182,268_AL_.jpg",
    description: "A high-octane thriller that unfolds over a single dangerous night.",
    recommended: true
  }
];


/* -------------------------
   HELPER: SHOW MESSAGE
------------------------- */
function showMessage(text, isError = false) {
  reviewMessage.textContent = text;
  reviewMessage.classList.add("show");

  if (isError) {
    reviewMessage.style.color = "#ff6b6b";
    reviewMessage.style.borderColor = "rgba(255, 107, 107, 0.3)";
    reviewMessage.style.background = "rgba(255, 107, 107, 0.08)";
  } else {
    reviewMessage.style.color = "#00d4ff";
    reviewMessage.style.borderColor = "rgba(0, 212, 255, 0.2)";
    reviewMessage.style.background = "rgba(0, 212, 255, 0.08)";
  }

  setTimeout(() => {
    reviewMessage.classList.remove("show");
  }, 4000);
}

/* -------------------------
   HELPER: CREATE MOVIE CARD
------------------------- */
function createMovieCard(movie) {
  return `
    <div class="movie-card">
      <img src="${movie.poster}" alt="${movie.title}" loading="lazy" />
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <div class="movie-meta">${movie.genre} • ${movie.year}</div>
        <p>${movie.description}</p>
      </div>
    </div>
  `;
}

/* -------------------------
   LOAD ALL MOVIES
------------------------- */
async function loadMovies() {
  try {
    const response = await fetch(`${API_URL}/api/movies`);

    if (!response.ok) {
      throw new Error("Failed to load movies");
    }

    const movies = await response.json();

    moviesContainer.innerHTML = "";
    movieSelect.innerHTML = `<option value="">Select Movie</option>`;

    if (!movies.length) {
      moviesContainer.innerHTML = `<p class="empty-state">No movies available right now.</p>`;
      return;
    }

    movies.forEach((movie) => {
      moviesContainer.innerHTML += createMovieCard(movie);

      movieSelect.innerHTML += `
        <option value="${movie.id}">${movie.title}</option>
      `;
    });
  } catch (error) {
    console.error("Error loading movies:", error);
    // Use fallback data if API fails
    moviesContainer.innerHTML = "";
    movieSelect.innerHTML = `<option value="">Select Movie</option>`;
    
    if (FALLBACK_MOVIES.length > 0) {
      FALLBACK_MOVIES.forEach((movie) => {
        moviesContainer.innerHTML += createMovieCard(movie);
        movieSelect.innerHTML += `
          <option value="${movie.id}">${movie.title}</option>
        `;
      });
    } else {
      moviesContainer.innerHTML = `<p class="empty-state">Failed to load movies.</p>`;
    }
  }
}

/* -------------------------
   LOAD ALL MOVIES
------------------------- */
async function loadMovies() {
  try {
    const response = await fetch(`${API_URL}/api/movies`);

    if (!response.ok) {
      throw new Error("Failed to load movies");
    }

    const movies = await response.json();

    moviesContainer.innerHTML = "";
    movieSelect.innerHTML = `<option value="">Select Movie</option>`;

    if (!movies.length) {
      moviesContainer.innerHTML = `<p class="empty-state">No movies available right now.</p>`;
      return;
    }

    movies.forEach((movie) => {
      moviesContainer.innerHTML += createMovieCard(movie);
      movieSelect.innerHTML += `<option value="${movie.id}">${movie.title}</option>`;
    });
  } catch (error) {
    console.error("Error loading movies:", error);
    // Use fallback data if API fails
    moviesContainer.innerHTML = "";
    movieSelect.innerHTML = `<option value="">Select Movie</option>`;
    
    if (FALLBACK_MOVIES.length > 0) {
      FALLBACK_MOVIES.forEach((movie) => {
        moviesContainer.innerHTML += createMovieCard(movie);
        movieSelect.innerHTML += `
          <option value="${movie.id}">${movie.title}</option>
        `;
      });
    } else {
      moviesContainer.innerHTML = `<p class="empty-state">Failed to load movies.</p>`;
    }
  }
}

/* -------------------------
   LOAD RECOMMENDED MOVIES
------------------------- */
async function loadRecommendedMovies() {
  try {
    const response = await fetch(`${API_URL}/api/recommended`);

    if (!response.ok) {
      throw new Error("Failed to load recommended movies");
    }

    const movies = await response.json();

    recommendedContainer.innerHTML = "";

    if (!movies.length) {
      recommendedContainer.innerHTML = `<p class="empty-state">No recommended movies available.</p>`;
      return;
    }

    movies.forEach((movie) => {
      recommendedContainer.innerHTML += createMovieCard(movie);
    });
  } catch (error) {
    console.error("Error loading recommended movies:", error);
    // Use fallback data if API fails
    recommendedContainer.innerHTML = "";
    const recommendedMovies = FALLBACK_MOVIES.filter(m => m.recommended);
    if (recommendedMovies.length > 0) {
      recommendedMovies.forEach((movie) => {
        recommendedContainer.innerHTML += createMovieCard(movie);
      });
    } else {
      recommendedContainer.innerHTML = `<p class="empty-state">Failed to load recommendations.</p>`;
    }
  }
}

/* -------------------------
   LOAD AND DISPLAY REVIEWS FOR SELECTED MOVIE
------------------------- */
const reviewsDisplaySection = document.getElementById("reviewsDisplaySection");
const reviewsContainer = document.getElementById("reviewsContainer");
const reviewsMovieTitle = document.getElementById("reviewsMovieTitle");

async function loadReviews(movieId, movieTitle) {
  if (!movieId) {
    reviewsDisplaySection.style.display = "none";
    return;
  }

  try {
    console.log(`Loading reviews for movie ${movieId}...`);
    const response = await fetch(`${API_URL}/api/movies/${movieId}`);

    if (!response.ok) {
      throw new Error("Failed to load reviews");
    }

    const data = await response.json();
    const reviews = data.reviews || [];

    reviewsMovieTitle.textContent = `Reviews for "${movieTitle}"`;
    reviewsContainer.innerHTML = "";

    if (!reviews.length) {
      reviewsContainer.innerHTML = `<p class="empty-reviews">No reviews yet. Be the first to review this movie!</p>`;
      reviewsDisplaySection.style.display = "block";
      return;
    }

    reviews.forEach((review) => {
      const reviewDate = new Date(review.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

      const reviewCard = `
        <div class="review-card">
          <div class="review-header">
            <div>
              <div class="review-username">${review.username}</div>
              <div class="review-rating">${'⭐'.repeat(review.rating)} ${review.rating}/5 Stars</div>
            </div>
            <div class="review-date">${reviewDate}</div>
          </div>
          <p class="review-text">${review.review_text}</p>
        </div>
      `;
      reviewsContainer.innerHTML += reviewCard;
    });

    reviewsDisplaySection.style.display = "block";
  } catch (error) {
    console.error("Error loading reviews:", error);
    reviewsContainer.innerHTML = `<p class="empty-reviews">Unable to load reviews. Please try again later.</p>`;
    reviewsDisplaySection.style.display = "block";
  }
}

// Add event listener to movie select dropdown
movieSelect.addEventListener("change", (event) => {
  const movieId = event.target.value;
  const selectedOption = event.target.options[event.target.selectedIndex];
  const movieTitle = selectedOption.text;
  loadReviews(movieId, movieTitle);
});

/* -------------------------
   SEARCH MOVIES
------------------------- */
async function searchMovies() {
  const query = searchInput.value.trim();

  if (!query) {
    loadMovies();
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);

    if (!response.ok) {
      throw new Error("Search failed");
    }

    const movies = await response.json();

    moviesContainer.innerHTML = "";

    if (movies.length === 0) {
      moviesContainer.innerHTML = `<p class="empty-state">No Malayalam or Tamil movies found.</p>`;
      return;
    }

    movies.forEach((movie) => {
      moviesContainer.innerHTML += createMovieCard(movie);
    });
  } catch (error) {
    console.error("Search failed:", error);
    moviesContainer.innerHTML = `<p class="empty-state">Search failed. Try again.</p>`;
  }
}

/* -------------------------
   SUBMIT REVIEW
------------------------- */
reviewForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const reviewData = {
    movie_id: movieSelect.value,
    username: document.getElementById("username").value.trim(),
    rating: parseInt(document.getElementById("rating").value),
    review_text: document.getElementById("reviewText").value.trim()
  };

  if (!reviewData.movie_id || !reviewData.username || !reviewData.rating || !reviewData.review_text) {
    showMessage("✗ Please fill all fields", true);
    return;
  }

  try {
    console.log("Submitting review:", reviewData);
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewData)
    });

    console.log("Response status:", response.status);
    const data = await response.json();
    console.log("Response data:", data);

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit review");
    }

    showMessage("✓ Review submitted successfully!");
    reviewForm.reset();
    loadMovies();
  } catch (error) {
    console.error("Review submission failed:", error);
    showMessage(`✗ ${error.message || 'Failed to submit review. Please try again.'}`, true);
  }
});

/* -------------------------
   SEARCH ON ENTER
------------------------- */
searchInput.addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    searchMovies();
  }
});

/* -------------------------
   INITIAL LOAD
------------------------- */
loadMovies();
loadRecommendedMovies();
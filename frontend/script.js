const API_URL = "https://YOUR_RENDER_BACKEND_URL.onrender.com/api";

const moviesContainer = document.getElementById("moviesContainer");
const recommendedContainer = document.getElementById("recommendedContainer");
const movieSelect = document.getElementById("movieSelect");
const reviewForm = document.getElementById("reviewForm");
const reviewMessage = document.getElementById("reviewMessage");

/* -------------------------
   LOAD ALL MOVIES
------------------------- */
async function loadMovies() {
  try {
    const res = await fetch(`${API_URL}/movies`);
    const movies = await res.json();

    moviesContainer.innerHTML = "";
    movieSelect.innerHTML = `<option value="">Select Movie</option>`;

    movies.forEach(movie => {
      moviesContainer.innerHTML += `
        <div class="movie-card">
          <img src="${movie.poster}" alt="${movie.title}" />
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <div class="movie-meta">${movie.genre} • ${movie.year}</div>
            <p>${movie.description}</p>
          </div>
        </div>
      `;

      movieSelect.innerHTML += `
        <option value="${movie.id}">${movie.title}</option>
      `;
    });
  } catch (error) {
    console.error("Error loading movies:", error);
  }
}

/* -------------------------
   LOAD RECOMMENDED MOVIES
------------------------- */
async function loadRecommendedMovies() {
  try {
    const res = await fetch(`${API_URL}/recommended`);
    const movies = await res.json();

    recommendedContainer.innerHTML = "";

    movies.forEach(movie => {
      recommendedContainer.innerHTML += `
        <div class="movie-card">
          <img src="${movie.poster}" alt="${movie.title}" />
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <div class="movie-meta">${movie.genre} • ${movie.year}</div>
            <p>${movie.description}</p>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Error loading recommended movies:", error);
  }
}

/* -------------------------
   SEARCH MOVIES
------------------------- */
async function searchMovies() {
  const query = document.getElementById("searchInput").value.trim();

  if (!query) {
    loadMovies();
    return;
  }

  try {
    const res = await fetch(`${API_URL}/search?q=${encodeURIComponent(query)}`);
    const movies = await res.json();

    moviesContainer.innerHTML = "";

    if (movies.length === 0) {
      moviesContainer.innerHTML = `<p>No Malayalam or Tamil movies found.</p>`;
      return;
    }

    movies.forEach(movie => {
      moviesContainer.innerHTML += `
        <div class="movie-card">
          <img src="${movie.poster}" alt="${movie.title}" />
          <div class="movie-info">
            <h3>${movie.title}</h3>
            <div class="movie-meta">${movie.genre} • ${movie.year}</div>
            <p>${movie.description}</p>
          </div>
        </div>
      `;
    });
  } catch (error) {
    console.error("Search failed:", error);
  }
}

/* -------------------------
   SUBMIT REVIEW
------------------------- */
reviewForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const reviewData = {
    movie_id: movieSelect.value,
    username: document.getElementById("username").value,
    rating: document.getElementById("rating").value,
    review_text: document.getElementById("reviewText").value
  };

  try {
    const res = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewData)
    });

    const data = await res.json();

    if (res.ok) {
      reviewMessage.textContent = "✓ Review submitted successfully!";
      reviewMessage.classList.add("show");
      reviewForm.reset();
      setTimeout(() => reviewMessage.classList.remove("show"), 4000);
    } else {
      reviewMessage.textContent = `✗ ${data.error}`;
      reviewMessage.classList.add("show");
      setTimeout(() => reviewMessage.classList.remove("show"), 4000);
    }
  } catch (error) {
    reviewMessage.textContent = "✗ Failed to submit review";
    reviewMessage.classList.add("show");
    setTimeout(() => reviewMessage.classList.remove("show"), 4000);
    console.error(error);
  }
});

/* -------------------------
   INITIAL LOAD
------------------------- */
loadMovies();
loadRecommendedMovies();
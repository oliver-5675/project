const API_URL = "https://project-y7dn.onrender.com";

const moviesContainer = document.getElementById("moviesContainer");
const recommendedContainer = document.getElementById("recommendedContainer");
const movieSelect = document.getElementById("movieSelect");
const reviewForm = document.getElementById("reviewForm");
const reviewMessage = document.getElementById("reviewMessage");
const searchInput = document.getElementById("searchInput");

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
    moviesContainer.innerHTML = `<p class="empty-state">Failed to load movies.</p>`;
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
    recommendedContainer.innerHTML = `<p class="empty-state">Failed to load recommendations.</p>`;
  }
}

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
    rating: document.getElementById("rating").value,
    review_text: document.getElementById("reviewText").value.trim()
  };

  if (!reviewData.movie_id || !reviewData.username || !reviewData.rating || !reviewData.review_text) {
    showMessage("✗ Please fill all fields", true);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(reviewData)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Failed to submit review");
    }

    showMessage("✓ Review submitted successfully!");
    reviewForm.reset();
  } catch (error) {
    console.error("Review submission failed:", error);
    showMessage(`✗ ${error.message}`, true);
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
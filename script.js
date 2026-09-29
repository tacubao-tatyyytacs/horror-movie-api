const API_BASE = "http://127.0.0.1:3001";

const movieGrid = document.getElementById("movieGrid");
const message = document.getElementById("message");

const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");

const addMovieForm = document.getElementById("addMovieForm");
const formMessage = document.getElementById("formMessage");

const editMovieSection = document.getElementById("editMovie");
const editMovieForm = document.getElementById("editMovieForm");
const editMessage = document.getElementById("editMessage");

const detailsSection = document.getElementById("details");
const movieDetails = document.getElementById("movieDetails");
const backButton = document.getElementById("backButton");

const moviesSection = document.getElementById("movies");
const heroSection = document.getElementById("home");

const directorSelect = document.getElementById("director_id");
const editDirectorSelect = document.getElementById("editDirectorId");

const genreSelect = document.getElementById("genre_id");
let movies = [];


async function loadMovies() {

    message.textContent = "Loading movies...";

    try {

        const response = await fetch(`${API_BASE}/movies`);

        if (response.status === 404) {
            message.textContent = "Movies could not be found.";
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load movies");
        }

        movies = await response.json();

        displayMovies(movies);

    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to load movies. Please make sure the API is running.";

    }
}


function displayMovies(list) {

    movieGrid.innerHTML = "";

    if (list.length === 0) {

        message.textContent = "No movies found.";
        return;

    }

    message.textContent = `${list.length} movie(s) found.`;

    list.forEach(movie => {

        const card = document.createElement("div");

        card.className = "movie-card";

        card.innerHTML = `
            <h3>${movie.title}</h3>

            <p>
                <strong>Year:</strong>
                ${movie.release_year}
            </p>

            <p>
                <strong>Rating:</strong>
                ${movie.rating}
            </p>

            <p>
                <strong>Director:</strong>
                ${movie.director || "Unknown"}
            </p>

            <p>
                <strong>Genres:</strong>
                ${movie.genres || "None"}
            </p>

            <div class="card-buttons">

                <button onclick="showDetails(${movie.movie_id})">
                    View
                </button>

                <button onclick="editMovie(${movie.movie_id})">
                    Edit
                </button>

                <button
                    class="delete-button"
                    onclick="deleteMovie(${movie.movie_id})"
                >
                    Delete
                </button>

            </div>
        `;

        movieGrid.appendChild(card);

    });
}


async function showDetails(id) {

    movieDetails.innerHTML = "Loading movie...";

    detailsSection.classList.remove("hidden");

    moviesSection.classList.add("hidden");
    heroSection.classList.add("hidden");
    editMovieSection.classList.add("hidden");

    try {

        const response = await fetch(`${API_BASE}/movies/${id}`);

        if (response.status === 404) {

            movieDetails.innerHTML = `
                <h2>Movie Not Found</h2>
                <p>The movie you requested does not exist.</p>
            `;

            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load movie");
        }

        const movie = await response.json();

        movieDetails.innerHTML = `
            <h2>${movie.title}</h2>

            <p>
                <strong>Release Year:</strong>
                ${movie.release_year}
            </p>

            <p>
                <strong>Duration:</strong>
                ${movie.duration} minutes
            </p>

            <p>
                <strong>Rating:</strong>
                ${movie.rating}
            </p>

            <p>
                <strong>Director:</strong>
                ${movie.director || "Unknown"}
            </p>

            <p>
                <strong>Genres:</strong>
                ${movie.genres || "None"}
            </p>

            <p>
                <strong>Description:</strong>
                ${movie.description}
            </p>
        `;

        window.scrollTo(0, 0);

    } catch (error) {

        movieDetails.innerHTML = `
            <h2>Error</h2>
            <p>Unable to load this movie.</p>
        `;

    }
}


async function loadDirectors() {
    try {
        const response = await fetch(`${API_BASE}/directors`);

        if (!response.ok) {
            throw new Error("Failed to load directors");
        }

        const directors = await response.json();

        directorSelect.innerHTML =
            `<option value="">Select a director</option>`;

        editDirectorSelect.innerHTML =
            `<option value="">Select a director</option>`;

        directors.forEach(director => {
            const option = document.createElement("option");

            option.value = director.director_id;
            option.textContent = director.name;

            directorSelect.appendChild(option);

            const editOption = option.cloneNode(true);
            editDirectorSelect.appendChild(editOption);
        });

    } catch (error) {
        directorSelect.innerHTML =
            `<option value="">Unable to load directors</option>`;

        editDirectorSelect.innerHTML =
            `<option value="">Unable to load directors</option>`;
    }
}

async function loadGenres() {
    try {
        const response = await fetch(`${API_BASE}/genres`);

        if (!response.ok) {
            throw new Error("Failed to load genres");
        }

        const genres = await response.json();

        genreSelect.innerHTML =
            `<option value="">Select a genre</option>`;

        genres.forEach(genre => {
            const option = document.createElement("option");

            option.value = genre.genre_id;
            option.textContent = genre.genre_name;

            genreSelect.appendChild(option);
        });

    } catch (error) {
        genreSelect.innerHTML =
            `<option value="">Unable to load genres</option>`;
    }
}
addMovieForm.addEventListener("submit", async event => {

    event.preventDefault();

    formMessage.textContent = "Adding movie...";
    formMessage.className = "";

    const movie = {

        title: document.getElementById("title").value.trim(),

        release_year:
            Number(document.getElementById("release_year").value),

        duration:
            Number(document.getElementById("duration").value),

        rating:
            Number(document.getElementById("rating").value),

        description:
            document.getElementById("description").value.trim(),

        director_id:
            Number(document.getElementById("director_id").value),

        genre_id:
            Number(document.getElementById("genre_id").value)

    };

    try {

        const response = await fetch(`${API_BASE}/movies`, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(movie)

        });

        const data = await response.json();

        if (response.status === 400) {

            formMessage.textContent =
                data.error || "Please check your information.";

            formMessage.className = "error";

            return;
        }

        if (!response.ok) {

            throw new Error(data.error || "Failed to add movie");

        }

        formMessage.textContent =
            "Movie added successfully!";

        formMessage.className = "success";

        addMovieForm.reset();

        await loadMovies();

    } catch (error) {

        formMessage.textContent =
            error.message || "Failed to add movie.";

        formMessage.className = "error";

    }
});


async function editMovie(id) {

    editMovieSection.classList.remove("hidden");

    editMessage.textContent = "Loading movie...";
    editMessage.className = "";

    try {

        const response = await fetch(`${API_BASE}/movies/${id}`);

        if (response.status === 404) {

            editMessage.textContent =
                "Movie not found.";

            editMessage.className = "error";

            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load movie");
        }

        const movie = await response.json();

        document.getElementById("editMovieId").value =
            movie.movie_id;

        document.getElementById("editTitle").value =
            movie.title;

        document.getElementById("editReleaseYear").value =
            movie.release_year;

        document.getElementById("editDuration").value =
            movie.duration;

        document.getElementById("editRating").value =
            movie.rating;

        document.getElementById("editDescription").value =
            movie.description;

        editDirectorSelect.value =
            movie.director_id || "";

        editMessage.textContent = "";

        editMovieSection.scrollIntoView({
            behavior: "smooth"
        });

    } catch (error) {

        editMessage.textContent =
            "Unable to load movie.";

        editMessage.className = "error";

    }
}


editMovieForm.addEventListener("submit", async event => {

    event.preventDefault();

    editMessage.textContent = "Updating movie...";
    editMessage.className = "";

    const id =
        document.getElementById("editMovieId").value;

    const movie = {

        title:
            document.getElementById("editTitle").value.trim(),

        release_year:
            Number(document.getElementById("editReleaseYear").value),

        duration:
            Number(document.getElementById("editDuration").value),

        rating:
            Number(document.getElementById("editRating").value),

        description:
            document.getElementById("editDescription").value.trim(),

        director_id:
            Number(document.getElementById("editDirectorId").value)

    };

    try {

        const response = await fetch(
            `${API_BASE}/movies/${id}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(movie)
            }
        );

        const data = await response.json();

        if (response.status === 400) {

            editMessage.textContent =
                data.error || "Please check your information.";

            editMessage.className = "error";

            return;
        }

        if (response.status === 404) {

            editMessage.textContent =
                "Movie not found.";

            editMessage.className = "error";

            return;
        }

        if (!response.ok) {

            throw new Error(
                data.error || "Failed to update movie"
            );

        }

        editMessage.textContent =
            "Movie updated successfully!";

        editMessage.className = "success";

        await loadMovies();

    } catch (error) {

        editMessage.textContent =
            error.message || "Failed to update movie.";

        editMessage.className = "error";

    }
});


async function deleteMovie(id) {

    const confirmed =
        confirm("Are you sure you want to delete this movie?");

    if (!confirmed) {
        return;
    }

    try {

        const response = await fetch(
            `${API_BASE}/movies/${id}`,
            {
                method: "DELETE"
            }
        );

        const data = await response.json();

        if (response.status === 404) {

            message.textContent =
                "Movie not found. It may have already been deleted.";

            return;
        }

        if (!response.ok) {

            throw new Error(
                data.error || "Failed to delete movie"
            );

        }

        await loadMovies();

        message.textContent =
            "Movie deleted successfully.";

    } catch (error) {

        message.textContent =
            error.message || "Failed to delete movie.";

    }
}


function searchMovies() {

    const searchTerm =
        searchInput.value.toLowerCase().trim();

    const filteredMovies = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchTerm)
    );

    displayMovies(filteredMovies);
}


searchButton.addEventListener(
    "click",
    searchMovies
);


searchInput.addEventListener(
    "keyup",
    event => {

        if (event.key === "Enter") {
            searchMovies();
        }

    }
);


backButton.addEventListener("click", () => {

    detailsSection.classList.add("hidden");

    moviesSection.classList.remove("hidden");

    heroSection.classList.remove("hidden");

    window.scrollTo(0, 0);

});


document.getElementById("cancelEdit")
    .addEventListener("click", () => {

        editMovieSection.classList.add("hidden");

    });


loadDirectors();
loadGenres();
loadMovies();
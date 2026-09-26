const express = require("express");
const { Pool } = require("pg");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

app.get("/", (req, res) => {
    res.send("Horror Movie API is running!");
});

app.get("/movies", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name AS director,
                STRING_AGG(
                    genres.genre_name,
                    ', ' ORDER BY genres.genre_name
                ) AS genres
            FROM movies
            JOIN directors
                ON movies.director_id = directors.director_id
            JOIN movie_genres
                ON movies.movie_id = movie_genres.movie_id
            JOIN genres
                ON movie_genres.genre_id = genres.genre_id
            GROUP BY
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name
            ORDER BY movies.movie_id;
        `);

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch movies"
        });
    }
});
app.get("/movies/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name AS director,
                STRING_AGG(
                    genres.genre_name,
                    ', ' ORDER BY genres.genre_name
                ) AS genres
            FROM movies
            JOIN directors
                ON movies.director_id = directors.director_id
            JOIN movie_genres
                ON movies.movie_id = movie_genres.movie_id
            JOIN genres
                ON movie_genres.genre_id = genres.genre_id
            WHERE movies.movie_id = $1
            GROUP BY
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name;
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Movie not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch movie"
        });
    }
});
app.get("/directors", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                director_id,
                name
            FROM directors
            ORDER BY director_id;
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch directors"
        });
    }
});
app.get("/directors/:id/movies", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name AS director,
                STRING_AGG(
                    genres.genre_name,
                    ', ' ORDER BY genres.genre_name
                ) AS genres
            FROM movies
            JOIN directors
                ON movies.director_id = directors.director_id
            LEFT JOIN movie_genres
                ON movies.movie_id = movie_genres.movie_id
            LEFT JOIN genres
                ON movie_genres.genre_id = genres.genre_id
            WHERE directors.director_id = $1
            GROUP BY
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name
            ORDER BY movies.movie_id;
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Director not found or has no movies"
            });
        }

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch director's movies"
        });
    }
});
app.get("/genres", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                genre_id,
                genre_name
            FROM genres
            ORDER BY genre_id;
        `);

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch genres"
        });
    }
});
app.get("/genres/:id/movies", async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name AS director,
                STRING_AGG(
                    genres.genre_name,
                    ', ' ORDER BY genres.genre_name
                ) AS genres
            FROM movies
            JOIN directors
                ON movies.director_id = directors.director_id
            JOIN movie_genres
                ON movies.movie_id = movie_genres.movie_id
            JOIN genres
                ON movie_genres.genre_id = genres.genre_id
            WHERE genres.genre_id = $1
            GROUP BY
                movies.movie_id,
                movies.title,
                movies.release_year,
                movies.duration,
                movies.rating,
                movies.description,
                directors.name
            ORDER BY movies.movie_id;
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Genre not found or has no movies"
            });
        }

        res.json(result.rows);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to fetch genre movies"
        });
    }
});
app.post("/movies", async (req, res) => {
    try {
        const { title, release_year, duration, rating, description, director_id } = req.body;

        const result = await pool.query(`
            INSERT INTO movies
                (title, release_year, duration, rating, description, director_id)
            VALUES
                ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `, [title, release_year, duration, rating, description, director_id]);

        res.status(201).json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to create movie"
        });
    }
});
app.put("/movies/:id", async (req, res) => {
    try {
        const { title, release_year, duration, rating, description, director_id } = req.body;

        const result = await pool.query(`
            UPDATE movies
            SET
                title = $1,
                release_year = $2,
                duration = $3,
                rating = $4,
                description = $5,
                director_id = $6
            WHERE movie_id = $7
            RETURNING *;
        `, [title, release_year, duration, rating, description, director_id, req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Movie not found"
            });
        }

        res.json(result.rows[0]);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to update movie"
        });
    }
});
app.delete("/movies/:id", async (req, res) => {
    try {
        const result = await pool.query(`
            DELETE FROM movies
            WHERE movie_id = $1
            RETURNING *;
        `, [req.params.id]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Movie not found"
            });
        }

        res.json({
            message: "Movie deleted successfully",
            movie: result.rows[0]
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Failed to delete movie"
        });
    }
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
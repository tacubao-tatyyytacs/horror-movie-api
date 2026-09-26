# 🎬 Horror Movie API

This project was built using:

- Node.js
- Express.js
- PostgreSQL
- pgAdmin 4
- `pg` PostgreSQL client
- `dotenv`

The API provides information about movies, directors, and genres, and supports CRUD operations for movies.

---
## API Endpoints

### 1. GET /

Method: **GET**

Description: Checks if the Horror Movie API is running.

Request: `curl.exe http://localhost:3000/`

Response: `Horror Movie API is running!`


### 2. GET /movies

Method: **GET**

Description: Returns all movies in the database.

Request: `curl.exe http://localhost:3000/movies`

Response: `[{"movie_id":1,"title":"The Conjuring","release_year":2013,"duration":112,"rating":"7.5","description":"Paranormal investigators help a family experiencing supernatural activity in their home.","director":"James Wan","genres":"Horror, Supernatural"}]`


### 3. GET /movies/:id

Method: **GET**

Description: Returns a specific movie using its movie ID.

Request: `curl.exe http://localhost:3000/movies/1`

Response: `{"movie_id":1,"title":"The Conjuring","release_year":2013,"duration":112,"rating":"7.5","description":"Paranormal investigators help a family experiencing supernatural activity in their home.","director":"James Wan","genres":"Horror, Supernatural"}`


### 4. POST /movies

Method: **POST**

Description: Creates a new movie in the database.

Request: `curl.exe -X POST http://localhost:3000/movies -H "Content-Type: application/json" --data-binary "@movie.json"`

Response: `{"movie_id":16,"title":"Smile","release_year":2022,"duration":115,"rating":"6.5","description":"A new horror movie for testing the API.","director_id":3}`


### 5. PUT /movies/:id

Method: **PUT**

Description: Updates an existing movie using its movie ID.

Request: `curl.exe -X PUT http://localhost:3000/movies/16 -H "Content-Type: application/json" --data-binary "@movie.json"`

Response: `{"movie_id":16,"title":"Smile Updated","release_year":2022,"duration":115,"rating":"7.0","description":"Updated movie description.","director_id":3}`


### 6. DELETE /movies/:id

Method: **DELETE**

Description: Deletes a movie from the database using its movie ID.

Request: `curl.exe -X DELETE http://localhost:3000/movies/16`

Response: `{"message":"Movie deleted successfully","movie":{"movie_id":16,"title":"Smile Updated","release_year":2022,"duration":115,"rating":"7.0","description":"Updated movie description.","director_id":3}}`


### 7. GET /directors

Method: **GET**

Description: Returns all directors in the database.

Request: `curl.exe http://localhost:3000/directors`

Response: `[{"director_id":1,"name":"James Wan"},{"director_id":2,"name":"Wes Craven"},{"director_id":3,"name":"Jordan Peele"},{"director_id":4,"name":"Robert Eggers"},{"director_id":5,"name":"Mike Flanagan"}]`


### 8. GET /directors/:id/movies

Method: **GET**

Description: Returns all movies directed by a specific director.

Request: `curl.exe http://localhost:3000/directors/1/movies`

Response: `[{"movie_id":1,"title":"The Conjuring","release_year":2013,"duration":112,"rating":"7.5","description":"Paranormal investigators help a family experiencing supernatural activity in their home.","director":"James Wan","genres":"Horror, Supernatural"}]`


### 9. GET /genres

Method: **GET**

Description: Returns all genres in the database.

Request: `curl.exe http://localhost:3000/genres`

Response: `[{"genre_id":1,"genre_name":"Horror"},{"genre_id":2,"genre_name":"Thriller"},{"genre_id":3,"genre_name":"Supernatural"},{"genre_id":4,"genre_name":"Psychological"},{"genre_id":5,"genre_name":"Slasher"}]`


### 10. GET /genres/:id/movies

Method: **GET**

Description: Returns all movies belonging to a specific genre.

Request: `curl.exe http://localhost:3000/genres/1/movies`

Response: `[{"movie_id":1,"title":"The Conjuring","release_year":2013,"duration":112,"rating":"7.5","description":"Paranormal investigators help a family experiencing supernatural activity in their home.","director":"James Wan","genres":"Horror"}]`

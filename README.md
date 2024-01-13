# Game Library API

This is the backend API for the Game Library application. It provides a RESTful API for performing search and CRUD operations on games, developers, and genres.

## Technologies Used

- Node.js
- Express
- MongoDB
- Mongoose ODB

## Endpoints

### Home

- Retrieve a list of all items: `GET /home`

### Search

- Search for games, developers, and genres based on a search term: `GET /search/:search`

### Report

- Report for games, developers and genres: `POST /report`

### Images

- Retrieve the image associated with a game: `GET /image/:title`

### Game Routes

- Get All Games: `GET /games`
- Create Game: `GET /game/create`, `POST /game/create`
- Get Game: `GET /game/:name`
- Update Game: `GET /game/:name/update`, `POST /game/:name/update`
- Delete Game: `GET /game/:name/delete`, `POST /game/:name/delete`

### Developer Routes

- Get All Developers: `GET /developers`
- Create Developer: `GET /developer/create`, `POST /developer/create`
- Get Developer: `GET /developer/:name`
- Update Developer: `GET /developer/:name/update`, `POST /developer/:name/update`
- Delete Developer: `GET /developer/:name/delete`, `POST /developer/:name/delete`

### Genre Routes

- Get All Genres: `GET /genres`
- Create Genre: `GET /genre/create, POST /genre/create`
- Get Genre: `GET /genre/:name`
- Update Genre: `GET /genre/:name/update`, `POST /genre/:name/update`
- Delete Genre: `GET /genre/:name/delete`, `POST /genre/:name/delete`

const express = require("express");
const router = express.Router();
const gameController = require("../controllers/gameController");
const genreController = require("../controllers/genreController");
const developerController = require("../controllers/developerController");
const indexController = require("../controllers/indexController");

// Get All Items
router.get("/home", indexController.all_list);

// Search
router.get("/search/:search", indexController.search_all);

// Report
router.post("/report", indexController.report);

// Get Image
router.get("/image/:title", indexController.get_image);

// Get All games
router.get("/games", gameController.game_list);

// Crete game
router.get("/game/create", gameController.game_create_get);
router.post("/game/create", indexController.check_code, gameController.game_create_post);

// Get game
router.get("/game/:name", gameController.game_detail);

// Update game
router.get("/game/:name/update", gameController.game_update_get);
router.post("/game/:name/update", indexController.check_code, gameController.game_update_post);

// Delete game
router.get("/game/:name/delete", gameController.game_delete_get);
router.post("/game/:name/delete", indexController.check_code, gameController.game_delete_post);

// Get All developers
router.get("/developers", developerController.developer_list);

// Crete developer
router.get("/developer/create", developerController.developer_create_get);
router.post("/developer/create", indexController.check_code, developerController.developer_create_post);

// Get developer
router.get("/developer/:name", developerController.developer_detail);

// Update developer
router.get("/developer/:name/update", developerController.developer_update_get);
router.post("/developer/:name/update", indexController.check_code, developerController.developer_update_post);

// Delete developer
router.get("/developer/:name/delete", developerController.developer_delete_get);
router.post("/developer/:name/delete", indexController.check_code, developerController.developer_delete_post);

// Get All genres
router.get("/genres", genreController.genre_list);

// Create genre
router.get("/genre/create", genreController.genre_create_get);
router.post("/genre/create", indexController.check_code, genreController.genre_create_post);

// Get genre
router.get("/genre/:name", genreController.genre_detail);

// Update genre
router.get("/genre/:name/update", genreController.genre_update_get);
router.post("/genre/:name/update", indexController.check_code, genreController.genre_update_post);

// Delete genre
router.get("/genre/:name/delete", genreController.genre_delete_get);
router.post("/genre/:name/delete", indexController.check_code, genreController.genre_delete_post);

module.exports = router;

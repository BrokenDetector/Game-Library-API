const Game = require("../models/Game");
const Developer = require("../models/Developer");
const Genre = require("../models/Genre");
const asyncHandler = require("express-async-handler");

exports.all_list = asyncHandler(async (req, res, next) => {
    // Get list of all
    try {
        const allGames = await Game.find().populate("genre").exec();
        const allGenres = await Genre.find().populate("name").exec();
        const allDevelopers = await Developer.find().populate("name").exec();

        return res.json({ allGames, allDevelopers, allGenres, title: "GameLibrary" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.search_all = asyncHandler(async (req, res, next) => {
    try {
        const searchTerm = req.params.search || "";
        const regex = new RegExp(searchTerm, "i");

        const [games, developers, genres] = await Promise.all([
            Game.find({ title: { $regex: regex } })
                .populate("genre")
                .exec(),
            Developer.find({ name: { $regex: regex } }).exec(),
            Genre.find({ name: { $regex: regex } }).exec(),
        ]);

        const searchResults = [];

        games.forEach((game) => {
            searchResults.push({ ...game.toObject(), category: "Game" });
        });

        developers.forEach((developer) => {
            searchResults.push({ ...developer.toObject(), category: "Developer" });
        });

        genres.forEach((genre) => {
            searchResults.push({ ...genre.toObject(), category: "Genre" });
        });

        if (searchResults.length === 0) {
            return res.status(404).json({ message: "No matching items found" });
        }

        return res.json({ searchResults, title: "Search Results" });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

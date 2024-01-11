const Genre = require("../models/genre");
const Game = require("../models/game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.genre_list = asyncHandler(async (req, res, next) => {
    // Get list of all genres
    try {
        const allGenres = await Genre.find().populate("name").exec();

        if (!allGenres) return res.status(404).json({ message: "No genres found" });

        return res.json({ allGenres, title: "Genres" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.genre_create_get = asyncHandler(async (req, res, next) => {
    // Create genre
    try {
        res.json({ title: "Create Genre" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.genre_create_post = [
    // Create genre
    body("name", "Name must not be empty and have at least 2 symbols").trim().isLength({ min: 2 }).escape(),

    asyncHandler(async (req, res, next) => {
        try {
            const errors = validationResult(req);

            // Check if the name is a reserved keyword
            if (req.body.name.toLowerCase() == "create") {
                return res.status(400).json({ error: "Invalid genre name" });
            }

            // Check if genre already exist
            const existingGenre = await Genre.findOne({ name: req.params.name });
            if (existingGenre) {
                return res.status(400).json([{ msg: "A genre with this name already exist" }]);
            }

            const genre = new Genre({
                name: req.body.name,
            });
            if (!errors.isEmpty) {
                console.log(errors.array());
                return res.json(errors.array());
            } else {
                const newGenre = await genre.save();
                return res.json(newGenre);
            }
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }),
];

exports.genre_detail = asyncHandler(async (req, res, next) => {
    // Get one genre
    try {
        const genre = await Genre.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, "i") } }).exec();
        const gamesInGenre = await Game.find({ genre: genre }, "title imageUrl").exec();

        if (genre === null) {
            return res.status(404).json({ message: "Genre not found" });
        }

        return res.json({ genre, gamesInGenre, title: genre.name });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.genre_update_get = asyncHandler(async (req, res, next) => {
    // Update genre
    try {
        const genre = await Genre.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, "i") } }).exec();

        if (genre === null) {
            return res.status(404).json({ message: "Genre not found" });
        }

        res.json({ genre, title: "Update Genre" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.genre_update_post = [
    body("name", "Name must not be empty and have at least 2 symbols").trim().isLength({ min: 2 }).escape(),

    asyncHandler(async (req, res, next) => {
        try {
            const errors = validationResult(req);

            // Check if the name is a reserved keyword
            if (req.body.name.toLowerCase() == "create") {
                return res.status(400).json({ error: "Invalid genre name" });
            }

            const genreObject = await Genre.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, "i") } });

            const genre = new Genre({
                _id: genreObject._id,
                name: req.body.name,
            });

            if (!errors.isEmpty) {
                console.log(errors.array());
                return res.json(errors.array());
            } else {
                const newGenre = await Genre.findByIdAndUpdate(genreObject._id, genre);
                return res.json(newGenre);
            }
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }),
];
exports.genre_delete_get = asyncHandler(async (req, res, next) => {
    // Delete genre
    try {
        const genre = await Genre.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, "i") } }).exec();
        const gamesInGenre = await Game.find({ genre: genre }, "title imageUrl").exec();

        if (genre === null) {
            return res.status(404).json({ message: "Genre not found" });
        }

        res.json({ genre, gamesInGenre, title: "Delete Genre" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.genre_delete_post = asyncHandler(async (req, res, next) => {
    // Delete genre
    try {
        const genre = await Genre.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, "i") } }).exec();
        await Genre.findByIdAndDelete(genre._id);
        res.json("Deleted");
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

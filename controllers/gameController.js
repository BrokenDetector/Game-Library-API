const Game = require("../models/Game");
const Developer = require("../models/Developer");
const Genre = require("../models/Genre");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const multer = require("multer");
const sharp = require("sharp");
const fs = require("fs");

exports.game_list = asyncHandler(async (req, res, next) => {
    // Get list of all games
    try {
        const allGames = await Game.find().exec();

        if (!allGames) return res.status(404).json({ message: "No games Found" });

        return res.json({ allGames, title: "Games" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.game_create_get = asyncHandler(async (req, res, next) => {
    // Create game
    try {
        const [allDevelopers, allGenres] = await Promise.all([Developer.find().sort({ name: 1 }).exec(), Genre.find().exec()]);
        return res.json({ allDevelopers, allGenres, title: "Create Game" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.game_create_post = [
    asyncHandler(async (req, res, next) => {
        // Upload image
        try {
            // Check if game already exist
            const existingGame = await Game.findOne({ title: req.body.title });
            if (existingGame) {
                // return error and dont upload image
                return res.status(400).json({ error: "A game with this title already exists." });
            }

            if (!req.files.length > 0) return next();
            req.body.images = [];

            const { buffer, originalname } = req.files[0];
            const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9_\\-]/g, "-");
            const ref = `${timestamp}-${originalname}`;
            await sharp(buffer)
                .resize(640, 320)
                .toFormat("jpeg")
                .jpeg({ quality: 90 })
                .toFile("./public/images/" + ref);
            req.body.images.push(ref);
            next();
        } catch (err) {
            return res.json({ message: err.message });
        }
    }),

    // Validation middleware
    body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("dev", "Developer must be specified.").trim().isLength({ min: 1 }).escape(),
    body("genre", "Genre must be specified.").trim().isLength({ min: 1 }).escape(),

    body("description").optional().escape(),

    // Create game
    asyncHandler(async (req, res, next) => {
        try {
            const errors = validationResult(req);

            // Check if the name is a reserved keyword
            if (req.body.title.toLowerCase() == "create") {
                return res.status(400).json({ error: "Invalid game name" });
            }

            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.json(errors.array());
            } else {
                const developerObject = await Developer.findById(req.body.dev);
                const genreObject = await Genre.findById(req.body.genre);

                const game = new Game({
                    title: req.body.title,
                    developer: developerObject._id,
                    genre: genreObject._id,
                    description: req.body.description,
                    imageUrl: req.body.images ? req.body.images[0] : "blank_image.png",
                });

                try {
                    const newGame = await game.save();
                    return res.json(newGame);
                } catch (err) {
                    return res.json({ message: err.message });
                }
            }
        } catch (err) {
            return res.json({ message: err.message });
        }
    }),
];

exports.game_detail = asyncHandler(async (req, res, next) => {
    // Get one game
    try {
        const game = await Game.findOne({ title: { $regex: new RegExp(`^${req.params.name}$`, "i") } })
            .populate("developer")
            .populate("genre")
            .exec();

        if (game === null) {
            return res.status(404).json({ message: "Game not found" });
        }
        return res.json({ game, title: game.title });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.game_update_get = asyncHandler(async (req, res, next) => {
    // Update game
    try {
        const [game, allDevelopers, allGenres] = await Promise.all([
            Game.findOne({ title: { $regex: new RegExp(`^${req.params.name}$`, "i") } })
                .populate("developer")
                .populate("genre")
                .exec(),
            Developer.find().sort({ name: 1 }).exec(),
            Genre.find().exec(),
        ]);
        if (game === null) {
            return res.status(404).json({ message: "Game not found" });
        }

        return res.json({ game, allDevelopers, allGenres, title: "Update Game" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.game_update_post = [
    // Update Game

    asyncHandler(async (req, res, next) => {
        // Change image
        try {
            if (req.files && req.files.length > 0) {
                req.body.images = [];

                const { buffer, originalname } = req.files[0];
                const timestamp = new Date().toISOString().replace(/[^a-zA-Z0-9_\\-]/g, "-");
                const ref = `${timestamp}-${originalname}`;
                await sharp(buffer)
                    .resize(640, 320)
                    .toFormat("jpeg")
                    .jpeg({ quality: 90 })
                    .toFile("./public/images/" + ref);
                req.body.images.push(ref);
            }
            next();
        } catch (err) {
            return res.json({ message: err.message });
        }
    }),

    // Validation middleware
    body("title", "Title must not be empty.").trim().isLength({ min: 1 }).escape(),
    body("dev", "Developer must be specified.").trim().isLength({ min: 1 }).escape(),
    body("genre", "Genre must be specified.").trim().isLength({ min: 1 }).escape(),
    body("description").optional().escape(),

    asyncHandler(async (req, res, next) => {
        try {
            console.log("files correct");
            const errors = validationResult(req);

            // Check if the name is a reserved keyword
            if (req.body.title.toLowerCase() == "create") {
                return res.status(400).json({ error: "Invalid game name" });
            }

            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.json(errors.array());
            } else {
                const gameObject = await Game.findOne({ title: { $regex: new RegExp(req.params.name, "i") } });

                const imageFilename = gameObject.imageUrl;

                if (imageFilename !== "blank_image.png") {
                    const imagePath = `./public/images/${imageFilename}`;
                    if (fs.existsSync(imagePath)) {
                        fs.unlinkSync(imagePath);
                    }
                }

                const developerObject = await Developer.findById(req.body.dev);
                const genreObject = await Genre.findById(req.body.genre);

                const game = new Game({
                    _id: gameObject._id,
                    title: req.body.title,
                    developer: developerObject._id,
                    genre: genreObject._id,
                    description: req.body.description,
                    imageUrl: req.body.images ? req.body.images[0] : req.body.image,
                });

                const newGame = await Game.findByIdAndUpdate(gameObject._id, game);
                return res.json(newGame);
            }
        } catch (err) {
            return res.json({ message: err.message });
        }
    }),
];

exports.game_delete_get = asyncHandler(async (req, res, next) => {
    // Delete game
    try {
        const game = await Game.findOne({ title: { $regex: new RegExp(`^${req.params.name}$`, "i") } }).exec();

        if (game === null) {
            return res.status(404).json({ message: "Game not found" });
        }
        res.json({ game, title: "Delete Game" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.game_delete_post = asyncHandler(async (req, res, next) => {
    // Delete game
    try {
        const game = await Game.findOne({ title: { $regex: new RegExp(`^${req.params.name}$`, "i") } }).exec();

        if (game === null) {
            return res.status(404).json({ message: "Game not found" });
        }

        const imageFilename = game.imageUrl;

        await Game.findByIdAndDelete(game._id);
        if (imageFilename !== "blank_image.png") {
            const imagePath = `./public/images/${imageFilename}`;
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        res.json("Deleted");
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

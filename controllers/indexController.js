const Game = require("../models/Game");
const Developer = require("../models/Developer");
const Genre = require("../models/Genre");
const asyncHandler = require("express-async-handler");
const { sendMessageToTelegram } = require("../utils/telegram");
const multer = require("multer");

const multerStorage = multer.memoryStorage();
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith("image")) {
        cb(null, true);
    } else {
        cb("Please upload only images.", false);
    }
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});

exports.get_image = (req, res, next) => {
    const image = req.url.substr(7);
    res.sendFile(`${image}`, { root: "./public/images" });
};

exports.all_list = asyncHandler(async (req, res, next) => {
    // Get list of all
    try {
        const allGames = await Game.find().exec();
        const allGenres = await Genre.find().exec();
        const allDevelopers = await Developer.find().exec();

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
                .populate("developer")
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

exports.report = asyncHandler((req, res, next) => {
    try {
        const { message, page } = req.body;

        if (!page) {
            return res.status(400).json({ error: "Invalid report data" });
        }

        const reportData = {
            message,
            page,
            ipAddress: req.ip,
        };

        sendMessageToTelegram(reportData);
        res.json("Sent");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

exports.check_code = (req, res, next) => {
    try {
        // if headers Content-Type": "application/json"
        if (req.body.code) {
            if (req.body.code === "2024") {
                if (req.path === "/check-code") {
                    return res.status(200).json({ message: "Success" });
                } else {
                    next();
                }
            } else {
                res.status(403).json({ message: "Wrong Code" });
            }
        } else {
            upload.any()(req, res, (err) => {
                if (err) {
                    console.error("Multer Error: ", err);
                    return res.status(500).json({ message: "Error processing form data" });
                }

                if (req.body.code === "2024") {
                    if (req.path === "/check-code") {
                        return res.status(200).json({ message: "Success" });
                    } else {
                        next();
                    }
                } else {
                    res.status(403).json({ message: "Wrong Code" });
                }
            });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

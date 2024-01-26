const Developer = require("../models/Developer");
const Game = require("../models/Game");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.developer_list = asyncHandler(async (req, res, next) => {
    // Get list of all categories
    try {
        const allDevelopers = await Developer.find().exec();

        if (!allDevelopers) return res.status(404).json({ message: "No developers found" });

        return res.json({ allDevelopers, title: "Developers" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.developer_create_get = asyncHandler(async (req, res, next) => {
    // Create developer
    res.json({ title: "Create Developer" });
});

exports.developer_create_post = [
    // Validation middleware
    body("name", "Name must not be empty and have at least 2 symbols").trim().isLength({ min: 2 }).escape(),

    // Create developer
    asyncHandler(async (req, res, next) => {
        try {
            const errors = validationResult(req);

            // Check if the name is a reserved keyword
            if (req.body.name.toLowerCase() == "create") {
                console.log("error");
                return res.status(400).json({ error: "Invalid developer name" });
            }

            // Check if developer already exist
            const existingDev = await Developer.findOne({ name: req.body.name });
            if (existingDev) {
                return res.status(400).json([{ msg: "A developer with this name already exists." }]);
            }
            const developer = new Developer({
                name: req.body.name,
            });

            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.json(errors.array());
            } else {
                const newDev = await developer.save();
                return res.json(newDev);
            }
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }),
];

exports.developer_detail = asyncHandler(async (req, res, next) => {
    // Get one developer
    try {
        const developer = await Developer.findOne({ name: { $regex: new RegExp(`^${req.params.name}$`, "i") } }).exec();
        const allGamesFromDeveloper = await Game.find({ developer: developer }, "title imageUrl").exec();

        if (developer === null) {
            return res.status(404).json({ message: "Developer Not found" });
        }

        return res.json({ developer, allGamesFromDeveloper, title: developer.name });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.developer_update_get = asyncHandler(async (req, res, next) => {
    // Update developer
    try {
        const developer = await Developer.findOne({ name: new RegExp(`^${req.params.name}$`, "i") }).exec();
        if (developer === null) {
            return res.status(404).json({ message: "Developer not found" });
        }
        res.json({ developer, title: "Update Developer" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.developer_update_post = [
    // Update developer

    body("name", "Name must not be empty and have at least 2 symbols").trim().isLength({ min: 2 }).escape(),

    asyncHandler(async (req, res, next) => {
        try {
            const errors = validationResult(req);

            // Check if the name is a reserved keyword
            if (new RegExp(`^${req.params.name}$`, "i") === "create") {
                return res.status(400).json({ error: "Invalid developer name" });
            }

            const developer = await Developer.findOne({ name: new RegExp(`^${req.params.name}$`, "i") }).exec();
            const dev = {
                _id: developer._id,
                name: req.body.name,
            };

            if (!errors.isEmpty()) {
                console.log(errors.array());
                return res.json(errors.array());
            } else {
                const newDev = await Developer.findByIdAndUpdate(developer._id, dev);
                return res.json(newDev);
            }
        } catch (err) {
            res.status(404).json({ message: err.message });
        }
    }),
];

exports.developer_delete_get = asyncHandler(async (req, res, next) => {
    // Delete developer
    try {
        const developer = await Developer.findOne({ name: new RegExp(`^${req.params.name}$`, "i") }).exec();
        const allGamesFromDeveloper = await Game.find({ developer: developer }, "title imageUrl").exec();

        if (developer === null) {
            return res.status(404).json({ message: "Developer not found" });
        }
        res.json({ developer, allGamesFromDeveloper, title: "Delete Developer" });
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

exports.developer_delete_post = asyncHandler(async (req, res, next) => {
    // Delete developer
    try {
        const developer = await Developer.findOne({ name: { $regex: new RegExp(req.params.name, "i") } }).exec();
        await Developer.findByIdAndDelete(developer._id);
        res.json("Deleted");
    } catch (err) {
        res.status(404).json({ message: err.message });
    }
});

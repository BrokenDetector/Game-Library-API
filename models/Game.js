const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: { type: String, required: true, unique: true },
    developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
    description: { type: String },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
    imageUrl: { type: String },
});

module.exports = mongoose.model("Game", GameSchema);

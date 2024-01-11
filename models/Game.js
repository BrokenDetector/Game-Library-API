const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GameSchema = new Schema({
    title: { type: String, required: true, unique: true },
    developer: { type: Schema.Types.ObjectId, ref: "Developer", required: true },
    description: { type: String },
    genre: { type: Schema.Types.ObjectId, ref: "Genre", required: true },
    price: { type: Number },
    imageUrl: { type: String },
});

GameSchema.virtual("url").get(function () {
    return `/games/${this.name}`;
});

module.exports = mongoose.model("Game", GameSchema);

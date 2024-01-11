const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const GenreSchema = new Schema({
    name: { type: String, required: true, minLength: 3, maxLength: 1000, unique: true },
});

GenreSchema.virtual("url").get(function () {
    return `/genres/${this.name}`;
});

module.exports = mongoose.model("Genre", GenreSchema);
